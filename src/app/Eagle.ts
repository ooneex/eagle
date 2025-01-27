import type { ServeOptions, Server } from 'bun';
import { handler } from './handler';

export class Eagle {
  constructor(
    private readonly options?: {
      server?: Omit<ServeOptions, 'fetch'>;
    },
  ) {}

  public async start(): Promise<Server> {
    return Bun.serve({
      ...this.options?.server,
      port: this.options?.server?.port,
      hostname: this.options?.server?.hostname || '0.0.0.0',
      fetch: async (req: Request, server: Server): Promise<Response> => {
        return await handler(req, server);
      },
    });
  }
}
