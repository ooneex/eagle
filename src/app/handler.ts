import type { Server } from 'bun';
import { Collection } from '../collection/Collection';
import { container } from '../container/container';
import { ControllerNotFoundException } from '../controller/ControllerNotFoundException';
import { ControllerContainer } from '../controller/container';
import { dispatchControllerMiddlewares } from '../controller/dispatchControllerMiddlewares';
import { dispatchControllerValidator } from '../controller/dispatchControllerValidator';
import { findRoute } from '../controller/findRoute';
import type { IController } from '../controller/types';
import { Exception } from '../exception/Exception';
import { HeaderChecker } from '../header/HeaderChecker';
import type { StatusCodeType } from '../http/types';
import { dispatchMiddlewares } from '../middleware/dispatchMiddlewares';
import type { MiddlewareContextType } from '../middleware/types';
import { HttpRequest } from '../request/HttpRequest';
import { HttpResponse } from '../response/HttpResponse';
import { Role } from '../security/Role';
import { UnauthorizedException } from '../security/UnauthorizedException';
import { dispatchValidators } from '../validation/dispatchValidators';

export const handler = async (
  req: Request,
  server: Server,
): Promise<Response> => {
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

    if (context.user) {
      const user = context.user;
      const role = new Role(routeConfig.roles ?? []);
      if (!user.getRole().has(role)) {
        throw new UnauthorizedException('Access unauthorized', {
          user: {
            id: user.getId(),
            username: user.getUsername(),
            roles: user.getRole(),
          },
          route: {
            roles: routeConfig.roles,
          },
        });
      }
    }

    const requestPayload = context.request.payload.toJson();
    const requestParams = context.request.params.toJson();
    const requestQueries = context.request.queries.toJson();
    const requestCookies = context.request.cookies.toJson();
    const requestFiles = context.request.files.toJson();
    const requestForm = context.request.form.toJson();

    await dispatchValidators('payload', requestPayload);
    await dispatchValidators('params', requestParams);
    await dispatchValidators('queries', requestQueries);
    await dispatchValidators('cookies', requestCookies);
    await dispatchValidators('files', requestFiles);
    await dispatchValidators('form', requestForm);

    context.payload = (
      await dispatchControllerValidator({
        dataScope: 'payload',
        data: requestPayload,
        routeConfig,
      })
    )[0];
    context.params = (
      await dispatchControllerValidator({
        dataScope: 'params',
        data: requestParams,
        routeConfig,
      })
    )[0];
    context.queries = (
      await dispatchControllerValidator({
        dataScope: 'queries',
        data: requestQueries,
        routeConfig,
      })
    )[0];
    context.cookies = (
      await dispatchControllerValidator({
        dataScope: 'cookies',
        data: requestCookies,
        routeConfig,
      })
    )[0];
    context.files = (
      await dispatchControllerValidator({
        dataScope: 'files',
        data: requestFiles,
        routeConfig,
      })
    )[0];
    context.form = (
      await dispatchControllerValidator({
        dataScope: 'form',
        data: requestForm,
        routeConfig,
      })
    )[0];
    context.response = await controller.action(context);
    context = await dispatchControllerMiddlewares({
      event: 'response',
      context,
      routeConfig,
    });
    context = await dispatchMiddlewares('response', context);

    return context.response.build(context.request, {
      user: context.user,
      isAuthenticated: context.isAuthenticated,
    });
  } catch (e) {
    if (e instanceof ControllerNotFoundException) {
      const def = ControllerContainer.get<{ value: IController }>(
        'NotFoundController',
      );
      if (!def) {
        return context.response
          .notFound(e.message, e.data)
          .build(context.request, {
            user: context.user,
            isAuthenticated: context.isAuthenticated,
          });
      }
      const controller = def.value;
      context.response = await controller.action(context);
      return context.response.build(context.request, {
        user: context.user,
        isAuthenticated: context.isAuthenticated,
      });
    }

    if (e instanceof Exception) {
      if (e.response) {
        return e.response.build(context.request, {
          user: context.user,
          isAuthenticated: context.isAuthenticated,
        });
      }
      const def = ControllerContainer.get<{ value: IController }>(
        'ServerExceptionController',
      );
      if (!def) {
        return context.response
          .exception(e.message, e.data, e.status as StatusCodeType)
          .build(context.request, {
            user: context.user,
            isAuthenticated: context.isAuthenticated,
          });
      }
      const controller = def.value;
      context.response = await controller.action(context);
      return context.response.build(context.request, {
        user: context.user,
        isAuthenticated: context.isAuthenticated,
      });
    }

    return response.exception((e as Error).message).build(context.request, {
      user: context.user,
      isAuthenticated: context.isAuthenticated,
    });
  }
};
