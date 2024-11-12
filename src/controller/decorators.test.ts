import {
  ControllerContainer,
  DecoratorException,
  Get,
  Host,
  IController,
  Ip,
  NOT_FOUND_CONTROLLER_KEY,
  NotFound,
  Path,
  Post,
  SERVER_EXCEPTION_CONTROLLER_KEY,
  ServerException,
} from '@/controller/mod.ts';
import { IResponse } from '@/response/types.ts';
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
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);

      expect(config?.methods).toEqual(['GET']);
      expect(config?.paths).toEqual(['/test']);
    });

    it('should register POST method', () => {
      @Post('/create')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.methods).toEqual(['POST']);
      expect(config?.paths).toEqual(['/create']);
    });

    it('should work without path parameter', () => {
      @Get('/')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.methods).toEqual(['GET']);
      expect(config?.paths).toEqual(['/']);
    });
  });

  describe('Path Decorator', () => {
    it('should register path', () => {
      @Path('/api/v1')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.paths).toEqual(['/api/v1']);
    });

    it('should register multiple paths', () => {
      @Path('/api/v2')
      @Path('/api/v1')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
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
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).toThrow(DecoratorException);
    });
  });

  describe('Host Decorator', () => {
    it('should register string host', () => {
      @Host('example.com')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts).toEqual(['example.com']);
    });

    it('should register RegExp host', () => {
      const hostPattern = /.*\.example\.com/;
      @Host(hostPattern)
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts?.[0]).toBe(hostPattern);
    });

    it('should register multiple hosts', () => {
      @Host('api.example.com')
      @Host('example.com')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.hosts).toEqual(['example.com', 'api.example.com']);
    });
  });

  describe('Ip Decorator', () => {
    it('should register string IP', () => {
      @Ip('127.0.0.1')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.ips).toEqual(['127.0.0.1']);
    });

    it('should register RegExp IP pattern', () => {
      const ipPattern = /^192\.168\./;
      @Ip(ipPattern)
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.ips?.[0]).toBe(ipPattern);
    });

    it('should register multiple IPs', () => {
      @Ip('10.0.0.1')
      @Ip('192.168.1.1')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.ips).toEqual(['192.168.1.1', '10.0.0.1']);
    });
  });

  describe('NotFound Decorator', () => {
    it('should register not found controller', () => {
      @NotFound()
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(NOT_FOUND_CONTROLLER_KEY);
      expect(config?.name).toBe(NOT_FOUND_CONTROLLER_KEY);
      expect(config?.controller).toBe(TestController);
    });
  });

  describe('ServerException Decorator', () => {
    it('should register server exception controller', () => {
      @ServerException()
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(SERVER_EXCEPTION_CONTROLLER_KEY);
      expect(config?.name).toBe(SERVER_EXCEPTION_CONTROLLER_KEY);
      expect(config?.controller).toBe(TestController);
    });
  });

  describe('Combined Decorators', () => {
    it('should work with multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      @Path('/api')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
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
      @Get('/')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
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
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.controller).toBe(TestController);
    });
  });

  describe('Controller Action', () => {
    it('should ensure stored controller class has action method', () => {
      @Get('/')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
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

  describe('Controller Path Regexp', () => {
    it('should store path regexp for @Path decorator', () => {
      @Path('/users/:id')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.regexp?.[0]).toBeInstanceOf(RegExp);
      expect(config?.regexp?.[0].test('/users/123')).toBe(true);
      expect(config?.regexp?.[0].test('/users/abc')).toBe(true);
      expect(config?.regexp?.[0].test('/users')).toBe(false);
    });

    it('should store path regexp for method decorators with paths', () => {
      @Get('/posts/:id/comments')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.regexp?.[0]).toBeInstanceOf(RegExp);
      expect(config?.regexp?.[0].test('/posts/123/comments')).toBe(true);
      expect(config?.regexp?.[0].test('/posts/abc/comments')).toBe(true);
      expect(config?.regexp?.[0].test('/posts/comments')).toBe(false);
    });

    it('should store multiple regexp patterns for combined decorators', () => {
      @Get('/users/:userId/posts/:postId')
      @Path('/api')
      class TestController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestController.name);
      expect(config?.regexp?.length).toBe(2);
      expect(config?.regexp?.[0].test('/api')).toBe(true);
      expect(config?.regexp?.[1].test('/users/123/posts/456')).toBe(true);
      expect(config?.regexp?.[1].test('/users/abc/posts/def')).toBe(true);
      expect(config?.regexp?.[1].test('/users/posts')).toBe(false);
    });
  });
});
