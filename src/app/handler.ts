import { Collection } from '@/collection/Collection.ts';
import { container } from '@/container/container.ts';
import { ControllerNotFoundException } from '@/controller/ControllerNotFoundException.ts';
import { ControllerContainer } from '@/controller/container.ts';
import { dispatchControllerMiddlewares } from '@/controller/dispatchControllerMiddlewares.ts';
import { findRoute } from '@/controller/findRoute.ts';
import type { IController } from '@/controller/types.ts';
import { Exception } from '@/exception/Exception.ts';
import { HeaderChecker } from '@/header/HeaderChecker.ts';
import { dispatchMiddlewares } from '@/middleware/dispatchMiddlewares.ts';
import type { MiddlewareContextType } from '@/middleware/types.ts';
import { HttpRequest } from '@/request/HttpRequest.ts';
import { HttpResponse } from '@/response/HttpResponse.ts';
import type { IResponse } from '@/response/types.ts';
import { dispatchValidators } from '@/validation/dispatchValidators.ts';
import type { Server } from 'bun';

Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/') return new Response('Home page!');
    if (url.pathname === '/blog') return new Response('Blog!');
    return new Response('404!');
  },
});

export const ServerHandler = async (
  req: Request,
  server: Server,
): Promise<IResponse> => {
  let payload = {};
  let formData: FormData | null = null;
  const ip = server.requestIP(req)?.address ?? null;

  try {
    class Checker extends HeaderChecker {
      // biome-ignore lint/complexity/noUselessConstructor: trust me
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
  } catch (_e) {}

  const request = new HttpRequest(req, {
    ip,
    payload,
    formData,
  });
  const response = new HttpResponse();

  let context: MiddlewareContextType = {
    request,
    response,
    store: new Collection(),
  };

  try {
    context = await dispatchMiddlewares('request', context);
    const routeConfig = findRoute({
      path: request.path,
      method: request.method,
      host: request.host ?? undefined,
      ip: request.ip ?? undefined,
    });
    context.request = new HttpRequest(req, {
      ip,
      payload,
      formData,
      params: routeConfig.params,
    });
    const controller = container.get<IController>(routeConfig.value);
    context = await dispatchControllerMiddlewares({
      event: 'request',
      context,
      routeConfig,
    });
    // TODO: check user roles
    await dispatchValidators('payload', context.request.payload.toJson());
    await dispatchValidators('params', context.request.params.toJson());
    await dispatchValidators('queries', context.request.queries.toJson());
    await dispatchValidators('cookies', context.request.cookies.toJson());
    await dispatchValidators('files', context.request.files.toJson());
    await dispatchValidators('form', context.request.form.toJson());
    context.response = await controller.action(context);
    context = await dispatchControllerMiddlewares({
      event: 'response',
      context,
      routeConfig,
    });
    context = await dispatchMiddlewares('response', context);
    return context.response;
  } catch (e) {
    if (e instanceof ControllerNotFoundException) {
      const def = ControllerContainer.get<{ value: IController }>(
        'NotFoundController',
      );
      if (!def) {
        return context.response.notFound(e.message, e.data);
      }
      const controller = def.value;
      context.response = await controller.action(context);
      return context.response;
    }

    if (e instanceof Exception) {
      const def = ControllerContainer.get<{ value: IController }>(
        'ServerExceptionController',
      );
      if (!def) {
        return context.response.exception(e.message, e.data);
      }
      const controller = def.value;
      context.response = await controller.action(context);
      return context.response;
    }

    return response.exception((e as Error).message);
  }
};
