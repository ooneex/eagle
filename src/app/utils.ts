import { ControllerActionException } from '../controller/ControllerActionException.ts';
import { StoreControllerValueType } from '../controller/types.ts';
import { DocContainer } from '../doc/container.ts';
import { Exception } from '../exception/Exception.ts';
import { trim } from '../helper/trim.ts';
import { StatusTextType } from '../http/types.ts';
import { HttpRequest } from '../request/HttpRequest.ts';
import { IRequest } from '../request/types.ts';
import { HttpResponse } from '../response/HttpResponse.ts';
import { ScalarType } from '../types.ts';
import { IValidator } from '../validation/types.ts';
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
  let status: StatusTextType = 500;
  let message = 'Internal Server Error';
  let data: Record<string, unknown> | null = null;

  if (error instanceof Exception) {
    status = error.status as StatusTextType ?? 500;
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

  try {
    payload = await req.json();
  } catch (_e) {
    // ignore
  }

  return new HttpRequest(req, { params, payload });
};

export const buildControllerActionParameters = async (
  req: Request,
  definition: StoreControllerValueType,
) => {
  const paramsMap: Record<string, unknown> = {
    IRequest: await buildRequest(req, definition),
    IResponse: new HttpResponse(),
  };

  const jwt = (paramsMap.IRequest as IRequest).jwt;

  if (jwt) {
    (paramsMap.IRequest as IRequest).auth?.login(jwt);
  }

  paramsMap.MethodType = (paramsMap.IRequest as IRequest).method;
  paramsMap.RequestMethodType = paramsMap.MethodType;
  paramsMap.IUrl = (paramsMap.IRequest as IRequest).url;
  paramsMap.IReadonlyHeader = (paramsMap.IRequest as IRequest).header;
  paramsMap.IUserAgent = (paramsMap.IRequest as IRequest).userAgent;

  const parameters: unknown[] = [];

  const doc = DocContainer.get(definition.name);
  const params = doc ? doc.findParameters(definition.name, 'action') : [];

  for (const param of params) {
    const type = param.types[0];

    if (['boolean', 'number', 'bigint', 'string'].includes(type)) {
      const name = param.name;
      const req = paramsMap.IRequest as IRequest;
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
    request: paramsMap.IRequest as IRequest,
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

    if (
      !['payload', 'params', 'queries', 'headers'].includes(scope as string)
    ) {
      continue;
    }

    const data = scope === 'payload'
      ? request.payload.toJson()
      : scope === 'params'
      ? request.params.toJson()
      : scope === 'queries'
      ? request.queries.toJson()
      : scope === 'headers'
      ? request.header.toJson()
      : null;

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
