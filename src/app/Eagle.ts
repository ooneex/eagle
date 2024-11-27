import { container } from '../container/Container.ts';
import { ControllerActionException } from '../controller/ControllerActionException.ts';
import { IController } from '../controller/types.ts';
import { findController } from '../controller/utils.ts';
import { Logger } from '../logger/Logger.ts';
import { HttpResponse } from '../response/HttpResponse.ts';
import { register } from './register.ts';
import { EagleConfigType, IEagle, ServerListenParamsType } from './types.ts';
import {
  buildControllerActionParameters,
  buildDefaultNotFoundResponse,
  handleControllerMiddlewares,
  handleEnvValidation,
  handleGlobalMiddlewares,
  handleRequestCookiesValidation,
  handleRequestDataValidation,
  handleServerException,
} from './utils.ts';

export class Eagle implements IEagle {
  private readonly config?: EagleConfigType;

  constructor(config?: EagleConfigType) {
    this.config = config;
  }

  public async listen(options: Partial<ServerListenParamsType> = {}) {
    await register();

    if (this.config?.validators) {
      handleEnvValidation(this.config.validators);
    }

    this.run(options);
  }

  private run(options: Partial<ServerListenParamsType> = {}) {
    Deno.serve({
      ...options,
      onListen({ port, hostname }) {
        Logger.info(`Server started at http://${hostname}:${port}`);
      },
    }, async (req: Request) => {
      const definition = findController(req);

      if (!definition) {
        return buildDefaultNotFoundResponse(req);
      }

      const builtData = await buildControllerActionParameters(req, definition);

      const { parameters, request, response } = builtData;

      await handleGlobalMiddlewares(request, response, 'request');
      handleRequestDataValidation(request, definition);
      handleRequestCookiesValidation(request, definition);

      const controller = container.get<IController>(
        definition.name,
      );
      if (!controller) {
        return buildDefaultNotFoundResponse(req);
      }

      if (definition.middlewares) {
        await handleControllerMiddlewares(
          request,
          response,
          'request',
          definition.middlewares,
        );
      }

      try {
        const response = await controller.action(...parameters);

        if (!(response instanceof HttpResponse)) {
          throw new ControllerActionException(
            `[${definition.name}] Action must return IResponse`,
          );
        }

        if (definition.middlewares) {
          await handleControllerMiddlewares(
            request,
            response,
            'response',
            definition.middlewares,
          );
        }

        await handleGlobalMiddlewares(request, response, 'response');

        return response.build(request);
      } catch (error) {
        return handleServerException(req, error as Error);
      }
    });
  }
}
