import { ControllerActionException } from '@/controller/ControllerActionException.ts';
import { StoreControllerValueType } from '@/controller/types.ts';
import { DocContainer } from '@/doc/container.ts';
import { Exception } from '@/exception/Exception.ts';
import { trim } from '@/helper/trim.ts';
import { StatusCodeType } from '@/http/types.ts';
import { HttpRequest } from '@/request/HttpRequest.ts';
import { IRequest } from '@/request/types.ts';
import { HttpResponse } from '@/response/HttpResponse.ts';

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
    status = error.status as StatusCodeType ?? 500;
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
  paramsMap.MethodType = (paramsMap.IRequest as IRequest).method;
  paramsMap.RequestMethodType = paramsMap.MethodType;
  paramsMap.IUrl = (paramsMap.IRequest as IRequest).url;
  paramsMap.IReadonlyHeader = (paramsMap.IRequest as IRequest).header;
  paramsMap.IUserAgent = (paramsMap.IRequest as IRequest).userAgent;

  const parameters: unknown[] = [];

  const doc = DocContainer.get(definition.name);
  const params = doc ? doc.findParameters(definition.name, 'action') : [];

  for (const param of params) {
    const type = param.type;

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

  return parameters;
};