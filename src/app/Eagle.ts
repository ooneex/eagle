import { container } from '../container/Container.ts';
import { ControllerActionException } from '../controller/ControllerActionException.ts';
import { IController } from '../controller/types.ts';
import { findController } from '../controller/utils.ts';
import { HttpResponse } from '../response/HttpResponse.ts';
import { register } from './register.ts';
import { EagleConfigType, IEagle, ServerListenParamsType } from './types.ts';
import {
  buildControllerActionParameters,
  buildDefaultNotFoundResponse,
  checkUserPermissionsForController,
  handleControllerMiddlewares,
  handleEnvValidation,
  handleGlobalMiddlewares,
  handleRequestCookiesValidation,
  handleRequestDataValidation,
  handleRequestFilesValidation,
  handleServerException,
} from './utils.ts';

/**
 * Eagle class implements the core server functionality
 * @implements {IEagle}
 */
export class Eagle implements IEagle {
  /** Optional configuration for the Eagle server */
  private readonly config?: EagleConfigType;

  /**
   * Creates an instance of Eagle server
   * @param {EagleConfigType} [config] - Optional server configuration
   */
  constructor(config?: EagleConfigType) {
    this.config = config;
  }

  /**
   * Start listening for incoming requests
   * @param {Partial<ServerListenParamsType>} [options={}] - Server listen options
   * @returns {Promise<void>}
   */
  public async listen(
    options: Partial<ServerListenParamsType> = {},
  ): Promise<void> {
    await register();

    if (this.config?.validators) {
      handleEnvValidation(this.config.validators);
    }

    this.run(options);
  }

  /**
   * Internal method to run the server and handle requests
   * @param {Partial<ServerListenParamsType>} [options={}] - Server options
   * @private
   */
  private run(options: Partial<ServerListenParamsType> = {}) {
    Deno.serve({
      ...options,
    }, async (req: Request) => {
      try {
        const definition = findController(req);

        if (!definition) {
          return buildDefaultNotFoundResponse(req);
        }

        const builtData = await buildControllerActionParameters(
          req,
          definition,
        );

        const { parameters, request, response } = builtData;

        await handleGlobalMiddlewares(request, response, 'request');
        checkUserPermissionsForController(request, definition);
        handleRequestDataValidation(request, definition);
        handleRequestCookiesValidation(request, definition);
        handleRequestFilesValidation(request, definition);

        const controller = container.get<IController>(
          definition.name,
          'controller',
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

        const actionResponse = await controller.action(...parameters);

        if (!(response instanceof HttpResponse)) {
          throw new ControllerActionException(
            `[${definition.name}] Action must return IResponse`,
          );
        }

        if (definition.middlewares) {
          await handleControllerMiddlewares(
            request,
            actionResponse,
            'response',
            definition.middlewares,
          );
        }

        await handleGlobalMiddlewares(request, actionResponse, 'response');

        return response.build(request);
      } catch (error) {
        return handleServerException(req, error as Error);
      }
    });
  }
}
