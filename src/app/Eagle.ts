import '@/app/register.ts';
import { IEagle, ServerListenParamsType } from '@/app/types.ts';
import { container } from '@/container/Container.ts';

export class Eagle implements IEagle {
  public listen(options: Partial<ServerListenParamsType> = {}) {
    const controller = container.get('TestController');

    console.log(controller);

    Deno.serve(options, () => {
      return new Response('Hello, world!');
    });
  }
}
