import {
  ControllerContainer,
  DecoratorException,
  Get,
  Host,
  IController,
  Path,
  Post,
} from '@/controller/mod.ts';
import { IHttpResponse } from '@/response/types.ts';
import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';

describe('Controller Decorators', () => {
  beforeEach(() => {
    ControllerContainer.clear();
  });

  describe('HTTP Method Decorators', () => {
    it('should register GET method', () => {
      @Get('/test')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);

      expect(config?.methods).toEqual(['GET']);
      expect(config?.paths).toEqual(['/test']);
    });

    it('should register POST method', () => {
      @Post('/create')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.methods).toEqual(['POST']);
      expect(config?.paths).toEqual(['/create']);
    });

    it('should work without path parameter', () => {
      @Get()
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.methods).toEqual(['GET']);
      expect(config?.paths).toEqual([]);
    });
  });

  describe('Path Decorator', () => {
    it('should register path', () => {
      @Path('/api/v1')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.paths).toEqual(['/api/v1']);
    });

    it('should register multiple paths', () => {
      @Path('/api/v2')
      @Path('/api/v1')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.paths).toEqual(['/api/v1', '/api/v2']);
    });

    it('should throw error when used on non-class', () => {
      expect(() => {
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class TestController implements IController {
          // @ts-ignore: Testing runtime behavior
          @Path('/api/v1')
          action(): IHttpResponse {
            return {} as IHttpResponse;
          }
        }
      }).toThrow(DecoratorException);
    });
  });

  describe('Host Decorator', () => {
    it('should register string host', () => {
      @Host('example.com')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts).toEqual(['example.com']);
    });

    it('should register RegExp host', () => {
      const hostPattern = /.*\.example\.com/;
      @Host(hostPattern)
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts?.[0]).toBe(hostPattern);
    });

    it('should register multiple hosts', () => {
      @Host('api.example.com')
      @Host('example.com')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts).toEqual(['example.com', 'api.example.com']);
    });
  });

  describe('Combined Decorators', () => {
    it('should work with multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      @Path('/api')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts).toEqual(['example.com']);
      expect(config?.paths).toEqual(['/api', '/users']);
      expect(config?.methods).toEqual(['GET']);
    });
  });

  describe('Controller Storage', () => {
    it('should store controller class reference', () => {
      @Get()
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.controller).toBe(TestController);
    });

    it('should store same controller class for multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      @Path('/api')
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.controller).toBe(TestController);
    });
  });

  describe('Controller Action', () => {
    it('should ensure stored controller class has action method', () => {
      @Get()
      class TestController implements IController {
        action(): IHttpResponse {
          return {} as IHttpResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      const Controller = config?.controller!;

      expect(Controller).toBeDefined();
      expect(new Controller()).toHaveProperty(
        'action',
      );
    });
  });
});
