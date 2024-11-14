import { container } from '@/container/mod.ts';
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
      class Test2Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test2Controller.name);
      expect(config?.methods).toEqual(['POST']);
      expect(config?.paths).toEqual(['/create']);
    });

    it('should work without path parameter', () => {
      @Get('/')
      class Test3Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test3Controller.name);
      expect(config?.methods).toEqual(['GET']);
      expect(config?.paths).toEqual(['/']);
    });
  });

  describe('Path Decorator', () => {
    it('should register path', () => {
      @Path('/api/v1')
      class Test4Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test4Controller.name);
      expect(config?.paths).toEqual(['/api/v1']);
    });

    it('should register multiple paths', () => {
      @Path('/api/v2')
      @Path('/api/v1')
      class Test5Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test5Controller.name);
      expect(config?.paths).toEqual(['/api/v1', '/api/v2']);
    });

    it('should throw error when used on non-class', () => {
      expect(() => {
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class Test6Controller implements IController {
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
      class Test6Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test6Controller.name);
      expect(config?.hosts).toEqual(['example.com']);
    });

    it('should register RegExp host', () => {
      const hostPattern = /.*\.example\.com/;
      @Host(hostPattern)
      class Test7Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test7Controller.name);
      expect(config?.hosts?.[0]).toBe(hostPattern);
    });

    it('should register multiple hosts', () => {
      @Host('api.example.com')
      @Host('example.com')
      class Test8Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test8Controller.name);
      expect(config?.hosts).toEqual(['example.com', 'api.example.com']);
    });
  });

  describe('Ip Decorator', () => {
    it('should register string IP', () => {
      @Ip('127.0.0.1')
      class Test9Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test9Controller.name);
      expect(config?.ips).toEqual(['127.0.0.1']);
    });

    it('should register RegExp IP pattern', () => {
      const ipPattern = /^192\.168\./;
      @Ip(ipPattern)
      class Test10Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test10Controller.name);
      expect(config?.ips?.[0]).toBe(ipPattern);
    });

    it('should register multiple IPs', () => {
      @Ip('10.0.0.1')
      @Ip('192.168.1.1')
      class Test11Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test11Controller.name);
      expect(config?.ips).toEqual(['192.168.1.1', '10.0.0.1']);
    });
  });

  describe('NotFound Decorator', () => {
    it('should register not found controller', () => {
      @NotFound()
      class Test12Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const controller = container.get(
        NOT_FOUND_CONTROLLER_KEY,
        'controller',
      );
      expect(controller).toBeInstanceOf(Test12Controller);
    });
  });

  describe('ServerException Decorator', () => {
    it('should register server exception controller', () => {
      @ServerException()
      class Test13Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const controller = container.get(
        SERVER_EXCEPTION_CONTROLLER_KEY,
        'controller',
      );
      expect(controller).toBeInstanceOf(Test13Controller);
    });
  });

  describe('Combined Decorators', () => {
    it('should work with multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      @Path('/api')
      class Test14Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test14Controller.name);
      expect(config?.hosts).toEqual(['example.com']);
      expect(config?.paths).toEqual(['/api', '/users']);
      expect(config?.methods).toEqual(['GET']);
    });
  });

  describe('Controller Storage', () => {
    it('should store controller class reference', () => {
      @Get('/')
      class Test15Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const controller = container.get(
        Test15Controller.name,
        'controller',
      );
      expect(controller).toBeInstanceOf(Test15Controller);
    });

    it('should store same controller class for multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      @Path('/api')
      class Test16Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const controller = container.get(
        Test16Controller.name,
        'controller',
      );
      expect(controller).toBeInstanceOf(Test16Controller);
    });
  });

  describe('Controller Action', () => {
    it('should ensure stored controller class has action method', () => {
      @Get('/')
      class Test17Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const controller = container.get(
        Test17Controller.name,
        'controller',
      );

      expect(controller).toBeDefined();
      expect(controller).toHaveProperty('action');
    });
  });

  describe('Controller Path Regexp', () => {
    it('should store path regexp for @Path decorator', () => {
      @Path('/users/:id')
      class Test18Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test18Controller.name);
      expect(config?.regexp?.[0]).toBeInstanceOf(RegExp);
      expect(config?.regexp?.[0].test('/users/123')).toBe(true);
      expect(config?.regexp?.[0].test('/users/abc')).toBe(true);
      expect(config?.regexp?.[0].test('/users')).toBe(false);
    });

    it('should store path regexp for method decorators with paths', () => {
      @Get('/posts/:id/comments')
      class Test19Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test19Controller.name);
      expect(config?.regexp?.[0]).toBeInstanceOf(RegExp);
      expect(config?.regexp?.[0].test('/posts/123/comments')).toBe(true);
      expect(config?.regexp?.[0].test('/posts/abc/comments')).toBe(true);
      expect(config?.regexp?.[0].test('/posts/comments')).toBe(false);
    });

    it('should store multiple regexp patterns for combined decorators', () => {
      @Get('/users/:userId/posts/:postId')
      @Path('/api')
      class Test20Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test20Controller.name);
      expect(config?.regexp?.length).toBe(2);
      expect(config?.regexp?.[0].test('/api')).toBe(true);
      expect(config?.regexp?.[1].test('/users/123/posts/456')).toBe(true);
      expect(config?.regexp?.[1].test('/users/abc/posts/def')).toBe(true);
      expect(config?.regexp?.[1].test('/users/posts')).toBe(false);
    });
  });

  describe('Controller Class Name', () => {
    it('should throw error if class name does not end with Controller', () => {
      expect(() => {
        @Path('/users')
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class TestClass implements IController {
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).toThrow(DecoratorException);
    });

    it('should not throw error if class name ends with Controller', () => {
      expect(() => {
        @Path('/users')
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class Test21Controller implements IController {
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).not.toThrow();
    });

    it('should throw error if class does not have action method', () => {
      expect(() => {
        @Get('/')
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class Test22Controller implements IController {}
      }).toThrow(DecoratorException);
    });

    it('should throw error if action method is not defined', () => {
      expect(() => {
        @Get('/')
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class Test23Controller implements IController {}
      }).toThrow(DecoratorException);
    });

    it('should not throw error if action method is defined', () => {
      expect(() => {
        @Get('/')
        // @ts-ignore: Testing runtime behavior
        // deno-lint-ignore no-unused-vars
        class Test24Controller implements IController {
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).not.toThrow();
    });
  });
});
