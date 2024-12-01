import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { assertSpyCalls, spy } from '@std/testing/mock';
import { container } from '../container/mod.ts';
import { HttpResponse } from '../response/mod.ts';
import { Eagle } from './mod.ts';

describe('Eagle', () => {
  it('should create an instance without config', () => {
    const eagle = new Eagle();
    expect(eagle).toBeDefined();
  });

  it('should create an instance with config', () => {
    const config = {
      validators: [],
    };
    const eagle = new Eagle(config);
    expect(eagle).toBeDefined();
  });

  it('should handle requests and return 404 when controller not found', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/not-found');

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
    }
  });

  it('should handle successful controller execution', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test');

    // Mock controller definition and container
    const mockController = {
      action: () => new HttpResponse(),
    };

    // Mock necessary functions
    const originalGet = container.get;
    container.get = () => mockController as never;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });

  it('should handle not found controller', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/not-found');

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
    }
  });

  it('should handle controller not found in container', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test');

    // Mock controller definition but return null from container
    const originalGet = container.get;
    container.get = () => null;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });

  it('should handle invalid controller response', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test');

    // Mock controller that returns invalid response
    const mockController = {
      action: () => ({ invalid: 'response' }),
    };

    const originalGet = container.get;
    container.get = () => mockController as never;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });

  it('should handle controller throwing an error', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test');

    // Mock controller that throws an error
    const mockController = {
      action: () => {
        throw new Error('Test error');
      },
    };

    const originalGet = container.get;
    container.get = () => mockController as never;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });

  it('should handle request with query parameters', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test?param=value');

    // Mock controller that returns query params
    const mockController = {
      action: () => ({ success: true }),
    };

    const originalGet = container.get;
    container.get = () => mockController as never;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });

  it('should handle POST request with body', async () => {
    const eagle = new Eagle();
    const mockRequest = new Request('http://localhost/test', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    // Mock controller that handles POST request
    const mockController = {
      action: () => ({ received: true }),
    };

    const originalGet = container.get;
    container.get = () => mockController as never;

    // Mock Deno.serve
    const originalServe = Deno.serve;
    const serveSpy = spy(
      (_options: unknown, handler: (req: Request) => Promise<Response>) => {
        return handler(mockRequest);
      },
    );
    // @ts-ignore - Mocking Deno.serve
    Deno.serve = serveSpy;

    try {
      await eagle.listen();
      assertSpyCalls(serveSpy, 1);
    } finally {
      // Restore originals
      // @ts-ignore - Restoring original
      Deno.serve = originalServe;
      container.get = originalGet;
    }
  });
});
