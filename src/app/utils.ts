import { container } from '../container/Container.ts';
import { ControllerContainer } from '../controller/container.ts';
import { ControllerActionException } from '../controller/ControllerActionException.ts';
import { IController, StoreControllerValueType } from '../controller/types.ts';
import { SERVER_EXCEPTION_CONTROLLER_KEY } from '../controller/utils.ts';
import { DocContainer } from '../doc/container.ts';
import { Exception } from '../exception/Exception.ts';
import { HeaderChecker } from '../header/HeaderChecker.ts';
import { trim } from '../helper/trim.ts';
import { StatusCodeType } from '../http/types.ts';
import { IMiddleware, MiddlewareScopeType } from '../middleware/types.ts';
import { HttpRequest } from '../request/HttpRequest.ts';
import { IRequest } from '../request/types.ts';
import { HttpResponse } from '../response/HttpResponse.ts';
import { IResponse } from '../response/types.ts';
import { Role } from '../security/Role.ts';
import { UnauthorizedException } from '../security/UnauthorizedException.ts';
import { ScalarType } from '../types.ts';
import { IValidator, ValidatorScopeType } from '../validation/types.ts';
import { ValidationFailedException } from '../validation/ValidationFailedException.ts';

export const buildDefaultNotFoundResponse = (req: Request) => {
  const response = new HttpResponse();
  const request = new HttpRequest(req);

  return response.notFound(
    `Route ${request.path} with ${request.method} method not found`,
    {
      path: request.path,
      method: request.method,
      ip: request.ip,
      host: request.host,
    },
  ).build();
};

export const buildDefaultServerExceptionResponse = (
  error: Error,
) => {
  let status: StatusCodeType = 500;
  let message = 'Internal Server Error';
  let data: Record<string, unknown> | null = null;

  if (error instanceof Exception) {
    status = error.status as StatusCodeType;
    message = error.message;
    data = error.data;
  }

  const response = new HttpResponse();

  return response.exception(message, data, status).build();
};

export const buildRequest = async (
  req: Request,
  definition: StoreControllerValueType,
) => {
  const url = new URL(req.url);
  const path = `/${trim(url.pathname, '/')}`;

  let params = {};

  for (const r of definition?.regexp ?? []) {
    const match = path.match(r);
    if (match) {
      params = match.groups ?? {};
      break;
    }
  }

  let payload = {};
  let formData: FormData | null = null;

  try {
    class Checker extends HeaderChecker {
      constructor(headers: Headers) {
        super(headers);
      }
    }

    const checker = new Checker(req.headers);

    if (checker.isJson()) {
      payload = await req.json();
    }

    if (checker.isFormData()) {
      formData = await req.formData();
    }
  } catch (_e) {
    // ignore
  }

  return new HttpRequest(req, { params, payload, formData });
};

export const buildControllerActionParameters = async (
  req: Request,
  definition: StoreControllerValueType,
  exception?: Exception,
) => {
  const request: IRequest = await buildRequest(req, definition);
  const response = new HttpResponse();

  const paramsMap: Record<string, unknown> = {
    IRequest: request,
    IResponse: response,
  };

  paramsMap.MethodType = request.method;
  paramsMap.RequestMethodType = paramsMap.MethodType;
  paramsMap.IUrl = request.url;
  paramsMap.IReadonlyHeader = request.header;
  paramsMap.IUserAgent = request.userAgent;
  paramsMap.Error = exception;
  paramsMap.Exception = exception;

  const parameters: unknown[] = [];

  const doc = DocContainer.get(definition.name);
  const params = doc ? doc.findParameters(definition.name, 'action') : [];

  for (const param of params) {
    const type = param.types[0];

    if (['boolean', 'number', 'bigint', 'string'].includes(type)) {
      const name = param.name;
      const req = request;
      parameters.push(req.params.get(name) ?? null);

      continue;
    }

    if (!paramsMap[type]) {
      throw new ControllerActionException(
        `[${definition.name}] Dependency ${type} not found for ${param.name} parameter`,
      );
    }

    parameters.push(paramsMap[type]);
  }

  return {
    parameters,
    request,
    response,
  };
};

export const handleRequestDataValidation = (
  request: IRequest,
  definition: StoreControllerValueType,
): boolean => {
  const validators = definition.validators;

  if (!validators) {
    return true;
  }

  for (const validator of validators) {
    const scope = validator.getScope();
    const scopes: ValidatorScopeType[] = [
      'payload',
      'params',
      'queries',
      'headers',
      'form',
    ];

    if (!scopes.includes(scope)) {
      continue;
    }

    let data;
    switch (scope) {
      case 'payload':
        data = request.payload.toJson();
        break;
      case 'params':
        data = request.params.toJson();
        break;
      case 'queries':
        data = request.queries.toJson();
        break;
      case 'headers':
        data = request.header.toJson();
        break;
      case 'form':
        data = request.form.toJson();
        break;
      default:
        data = null;
    }

    if (!data) {
      continue;
    }

    const result = validator.validate(data);

    if (!result.success) {
      throw new ValidationFailedException(
        `Validation failed for ${definition.name} with ${scope} data`,
        {
          path: request.path,
          scope,
          validation: {
            success: result.success,
            data,
            errors: result.details.filter((detail) => !detail.success),
          },
        },
      );
    }
  }

  return true;
};

export const handleRequestCookiesValidation = (
  request: IRequest,
  definition: StoreControllerValueType,
): boolean => {
  const validators = definition.validators;

  if (!validators) {
    return true;
  }

  for (const validator of validators) {
    const scope = validator.getScope();

    if (scope !== 'cookies') {
      continue;
    }

    const data: Record<string, ScalarType> = {};
    for (const [name, cookie] of request.cookies) {
      data[name] = cookie.value;
    }

    const result = validator.validate(data);

    if (!result.success) {
      throw new ValidationFailedException(
        `Validation failed for ${definition.name} with cookies data`,
        {
          path: request.path,
          scope,
          validation: {
            success: result.success,
            data,
            errors: result.details.filter((detail) => !detail.success),
          },
        },
      );
    }
  }

  return true;
};

export const handleRequestFilesValidation = (
  request: IRequest,
  definition: StoreControllerValueType,
): boolean => {
  const validators = definition.validators;

  if (!validators) {
    return true;
  }

  for (const validator of validators) {
    const scope = validator.getScope();

    if (scope !== 'files') {
      continue;
    }

    for (const [name, file] of request.files) {
      const data = {
        name: file.name,
        originalName: file.originalName,
        type: file.type,
        size: file.size,
      };

      const result = validator.validate(data);

      if (!result.success) {
        throw new ValidationFailedException(
          `Validation failed for ${definition.name} with ${name} file`,
          {
            path: request.path,
            scope,
            validation: {
              success: result.success,
              data,
              errors: result.details.filter((detail) => !detail.success),
            },
          },
        );
      }
    }
  }

  return true;
};

export const handleEnvValidation = (
  validators: IValidator[],
): boolean => {
  for (const validator of validators) {
    const scope = validator.getScope();

    if (scope !== 'env') {
      continue;
    }

    const data = Deno.env.toObject();
    const result = validator.validate(data);

    if (!result.success) {
      const errors = result.details.filter((detail) => !detail.success);
      const error = errors[0];

      throw new ValidationFailedException(
        error.message,
        {
          scope,
          validation: {
            success: result.success,
            data,
            errors,
          },
        },
      );
    }
  }

  return true;
};

export const handleServerException = async (req: Request, error: Error) => {
  const definition = ControllerContainer.get(
    SERVER_EXCEPTION_CONTROLLER_KEY,
  ) || null;

  if (!definition) {
    return buildDefaultServerExceptionResponse(error as Error);
  }

  const controller = container.get<IController>(
    definition.name,
    'controller',
  );
  if (!controller) {
    return buildDefaultServerExceptionResponse(error as Error);
  }

  const builtData = await buildControllerActionParameters(
    req,
    definition,
    error as Exception,
  );

  const { parameters } = builtData;

  const response = await controller.action(...parameters);

  if (!(response instanceof HttpResponse)) {
    return buildDefaultServerExceptionResponse(
      new ControllerActionException(
        `[${definition.name}] Action must return IResponse`,
      ),
    );
  }

  return response.build();
};

export const handleGlobalMiddlewares = async (
  request: IRequest,
  response: IResponse,
  scope: MiddlewareScopeType,
) => {
  const middlewareStore = container.getStore('middleware');
  const middlewares = middlewareStore?.filter((_key, m) => {
    return m.value.getScope() === scope;
  }) ?? null;

  if (middlewares) {
    for (
      const { value } of middlewares.sort((a, b) =>
        a.value.value.getOrder() - b.value.value.getOrder()
      )
    ) {
      await value.value.execute({
        request,
        response,
      });
    }
  }
};

export const handleControllerMiddlewares = async (
  request: IRequest,
  response: IResponse,
  scope: MiddlewareScopeType,
  middlewares: IMiddleware[],
) => {
  const filteredMiddlewares = middlewares.filter((m) => {
    return m.getScope() === scope;
  }) ?? null;

  if (filteredMiddlewares) {
    for (
      const m of filteredMiddlewares.sort((a, b) => a.getOrder() - b.getOrder())
    ) {
      await m.execute({
        request,
        response,
      });
    }
  }
};

export const checkUserPermissionsForController = (
  request: IRequest,
  definition: StoreControllerValueType,
): boolean => {
  const roles = definition.roles;

  if (!roles || roles.length === 0) {
    return true;
  }

  const auth = request.auth;
  const user = auth?.getUser();

  if (!auth || !auth.isAuthenticated() || !user) {
    throw new UnauthorizedException('User is not authenticated', {
      path: request.path,
      method: request.method,
    });
  }

  const userRole = user.getRole();

  if (!userRole.hasRole(new Role(roles))) {
    throw new UnauthorizedException('Permission denied', {
      path: request.path,
      method: request.method,
    });
  }

  return true;
};
