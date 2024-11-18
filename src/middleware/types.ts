import type { Exception } from '../exception/Exception.ts';

export interface IMiddleware<Response = unknown> {
  next: (context: { request: Request; response: Response }) => {
    done?: boolean;
    response?: Response;
    exception?: Exception;
  };

  getScope: () => ('request' | 'response' | 'exception')[];
  getOrder: () => number;
}
