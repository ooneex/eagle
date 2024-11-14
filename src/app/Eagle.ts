import '@/app/register.ts';
import { IEagle, ServerListenParamsType } from '@/app/types.ts';
import {
  buildControllerActionParameters,
  buildDefaultNotFoundResponse,
  buildDefaultServerExceptionResponse,
  handleRequestCookiesValidation,
  handleRequestDataValidation,
} from '@/app/utils.ts';
import { container } from '@/container/Container.ts';
import { ControllerContainer } from '@/controller/container.ts';
import { ControllerActionException } from '@/controller/ControllerActionException.ts';
import { IController } from '@/controller/types.ts';
import {
  findController,
  SERVER_EXCEPTION_CONTROLLER_KEY,
} from '@/controller/utils.ts';
import { HttpResponse } from '@/response/HttpResponse.ts';

export class Eagle implements IEagle {
  public listen(options: Partial<ServerListenParamsType> = {}) {
    Deno.serve({
      ...options,
      onListen({ port }) {
        console.log(`Server started at http://localhost:${port}`);
      },
    }, async (req: Request) => {
      const definition = findController(req);

      if (!definition) {
        return buildDefaultNotFoundResponse(req);
      }

      const builtData = await buildControllerActionParameters(req, definition);

      const { parameters, request } = builtData;

      handleRequestDataValidation(request, definition);
      handleRequestCookiesValidation(request, definition);

      const controller = container.get<IController>(
        definition.name,
      );
      if (!controller) {
        return buildDefaultNotFoundResponse(req);
      }

      try {
        const response = await controller.action(...parameters);

        if (!(response instanceof HttpResponse)) {
          throw new ControllerActionException(
            `[${definition.name}] Action must return IResponse`,
          );
        }

        return response.build();
      } catch (error) {
        const definition = ControllerContainer.get(
          SERVER_EXCEPTION_CONTROLLER_KEY,
        ) || null;

        if (!definition) {
          return buildDefaultServerExceptionResponse(error as Error);
        }

        const builtData = await buildControllerActionParameters(
          req,
          definition,
        );

        const { parameters } = builtData;

        const controller = container.get<IController>(
          definition.name,
        );
        if (!controller) {
          return buildDefaultServerExceptionResponse(error as Error);
        }

        const response = await controller.action(...parameters);

        if (!(response instanceof HttpResponse)) {
          throw new ControllerActionException(
            `[${definition.name}] Action must return IResponse`,
          );
        }

        return response.build();
      }
    });
  }
}
