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

/**
 * Builds a default 404 Not Found response
 * @param req - The original request
 * @returns Response object with 404 status and error details
 */
export const buildDefaultNotFoundResponse = (req: Request): Response => {
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

/**
 * Builds a default server error response
 * @param error - The error that was thrown
 * @returns Response object with appropriate error status and details
 */
export const buildDefaultServerExceptionResponse = (
  error: Error,
): Response => {
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

/**
 * Builds a request object with parsed parameters and payload
 * @param req - The original request
 * @param definition - Controller definition metadata
 * @returns HttpRequest instance with parsed data
 */
export const buildRequest = async (
  req: Request,
  definition: StoreControllerValueType,
): Promise<HttpRequest> => {
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

/**
 * Builds parameters for a controller action
 * @param req - The original request
 * @param definition - Controller definition metadata
 * @param exception - Optional exception object
 * @returns Object containing parameters, request and response
 */
export const buildControllerActionParameters = async (
  req: Request,
  definition: StoreControllerValueType,
  exception?: Exception,
): Promise<{
  parameters: unknown[];
  request: IRequest;
  response: IResponse;
}> => {
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

/**
 * Validates request data against defined validators
 * @param request - The request object
 * @param definition - Controller definition metadata
 * @returns True if validation passes, throws error if fails
 */
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

/**
 * Validates request cookies against defined validators
 * @param request - The request object
 * @param definition - Controller definition metadata
 * @returns True if validation passes, throws error if fails
 */
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

/**
 * Validates uploaded files against defined validators
 * @param request - The request object
 * @param definition - Controller definition metadata
 * @returns True if validation passes, throws error if fails
 */
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

/**
 * Validates environment variables against defined validators
 * @param validators - Array of validators
 * @returns True if validation passes, throws error if fails
 */
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

/**
 * Handles server exceptions by routing to exception controller
 * @param req - The original request
 * @param error - The error that was thrown
 * @returns Built response from exception controller or default
 */
export const handleServerException = async (
  req: Request,
  error: Error,
): Promise<Response> => {
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

/**
 * Executes global middleware for a given scope
 * @param request - The request object
 * @param response - The response object
 * @param scope - Middleware scope to execute
 */
export const handleGlobalMiddlewares = async (
  request: IRequest,
  response: IResponse,
  scope: MiddlewareScopeType,
): Promise<void> => {
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

/**
 * Executes controller-specific middleware for a given scope
 * @param request - The request object
 * @param response - The response object
 * @param scope - Middleware scope to execute
 * @param middlewares - Array of middleware to execute
 */
export const handleControllerMiddlewares = async (
  request: IRequest,
  response: IResponse,
  scope: MiddlewareScopeType,
  middlewares: IMiddleware[],
): Promise<void> => {
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

/**
 * Checks if user has required permissions for a controller
 * @param request - The request object
 * @param definition - Controller definition metadata
 * @returns True if authorized, throws error if not
 */
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
