import '@/app/register.ts';
import { IEagle, ServerListenParamsType } from '@/app/types.ts';

export class Eagle implements IEagle {
  public listen(options: Partial<ServerListenParamsType> = {}) {
    Deno.serve(options, () => {
      return new Response('Hello, world!');
    });
  }
}
