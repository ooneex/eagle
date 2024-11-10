import type { IController } from '@/controller/types.ts';
import type { IMiddleware } from '@/middleware/types.ts';
import type { IEagle, ServerListenParamsType } from '@/types.ts';

export class Eagle implements IEagle {
  public listen(options: Partial<ServerListenParamsType> = {}) {
    Deno.serve(options, () => {
      return new Response('Hello, world!');
    });
  }

  public use(_middleware: IMiddleware): void {
    // TODO: Implement
  }
  public addController(_controller: IController): void {
    // TODO: Implement
  }
}
