// deno-lint-ignore-file no-unused-vars
import { container } from '@/container/mod.ts';
import {
  Admin,
  ControllerContainer,
  DecoratorException,
  Get,
  Host,
  IController,
  Ip,
  NOT_FOUND_CONTROLLER_KEY,
  NotFound,
  Post,
  Public,
  SERVER_EXCEPTION_CONTROLLER_KEY,
  ServerException,
  SuperAdmin,
} from '@/controller/mod.ts';
import { IMiddleware, MiddlewareScopeType } from '@/middleware/mod.ts';
import { IResponse } from '@/response/mod.ts';
import { ERole } from '@/security/mod.ts';
import { AbstractValidator, ValidatorScopeType } from '@/validation/mod.ts';
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

  describe('Role Decorators', () => {
    it('should register public role', () => {
      @Public()
      class TestPublicController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestPublicController.name);
      expect(config?.roles).toEqual([]);
    });

    it('should register admin role', () => {
      @Admin()
      class TestAdminController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestAdminController.name);
      expect(config?.roles).toEqual([ERole.ADMIN]);
    });

    it('should register super admin role', () => {
      @SuperAdmin()
      class TestSuperAdminController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(TestSuperAdminController.name);
      expect(config?.roles).toEqual([ERole.SUPER_ADMIN]);
    });
  });

  describe('Combined Decorators', () => {
    it('should work with multiple decorators', () => {
      @Host('example.com')
      @Get('/users')
      class Test14Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test14Controller.name);
      expect(config?.hosts).toEqual(['example.com']);
      expect(config?.paths).toEqual(['/users']);
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
      class Test20Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test20Controller.name);
      expect(config?.regexp?.length).toBe(1);
      expect(config?.regexp?.[0].test('/users/123/posts/456')).toBe(true);
      expect(config?.regexp?.[0].test('/users/abc/posts/def')).toBe(true);
      expect(config?.regexp?.[0].test('/users/posts')).toBe(false);
    });
  });

  describe('Controller Class Name', () => {
    it('should throw error if class name does not end with Controller', () => {
      expect(() => {
        @Get('/users')
        // @ts-ignore: Testing runtime behavior
        class TestClass implements IController {
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).toThrow(DecoratorException);
    });

    it('should not throw error if class name ends with Controller', () => {
      expect(() => {
        @Get('/users')
        // @ts-ignore: Testing runtime behavior
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
        class Test22Controller implements IController {}
      }).toThrow(DecoratorException);
    });

    it('should throw error if action method is not defined', () => {
      expect(() => {
        @Get('/')
        // @ts-ignore: Testing runtime behavior
        class Test23Controller implements IController {}
      }).toThrow(DecoratorException);
    });

    it('should not throw error if action method is defined', () => {
      expect(() => {
        @Get('/')
        // @ts-ignore: Testing runtime behavior
        class Test24Controller implements IController {
          action(): IResponse {
            return {} as IResponse;
          }
        }
      }).not.toThrow();
    });
  });

  describe('Controller Validations', () => {
    class TestValidator extends AbstractValidator {
      getScope(): ValidatorScopeType {
        return 'payload';
      }
    }

    it('should store validators for method decorators', () => {
      const testValidator = new TestValidator();

      @Get('/test', { validators: [testValidator] })
      class Test25Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test25Controller.name);
      expect(config?.validators).toContain(testValidator);
    });

    it('should store multiple validators from different decorators', () => {
      const methodValidator = new TestValidator();
      const pathValidator = new TestValidator();

      @Get('/test', { validators: [methodValidator, pathValidator] })
      class Test27Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test27Controller.name);
      expect(config?.validators).toContain(methodValidator);
      expect(config?.validators).toContain(pathValidator);
      expect(config?.validators?.length).toBe(2);
    });
  });

  describe('Controller Middlewares', () => {
    class TestMiddleware implements IMiddleware {
      execute(): Promise<void> {
        return Promise.resolve();
      }

      getScope(): MiddlewareScopeType {
        return 'request';
      }

      getOrder(): number {
        return 0;
      }
    }

    it('should store middlewares for method decorators', () => {
      const testMiddleware = new TestMiddleware();

      @Get('/test', { middlewares: [testMiddleware] })
      class Test28Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test28Controller.name);
      expect(config?.middlewares).toContain(testMiddleware);
    });

    it('should store multiple middlewares from different decorators', () => {
      const middleware1 = new TestMiddleware();
      const middleware2 = new TestMiddleware();

      @Get('/test', { middlewares: [middleware1, middleware2] })
      class Test29Controller implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(Test29Controller.name);
      expect(config?.middlewares).toContain(middleware1);
      expect(config?.middlewares).toContain(middleware2);
      expect(config?.middlewares?.length).toBe(2);
    });
  });

  describe('NotFound Decorator', () => {
    it('should throw if decorated class is not a controller', () => {
      ControllerContainer.delete(NOT_FOUND_CONTROLLER_KEY);

      expect(() => {
        @NotFound()
        // @ts-ignore: Testing runtime behavior
        class InvalidClass {}
      }).toThrow(DecoratorException);
    });
  });

  describe('ServerException Decorator', () => {
    it('should throw if decorated class is not a controller', () => {
      expect(() => {
        @ServerException()
        // @ts-ignore: Testing runtime behavior
        class InvalidClass {}
      }).toThrow(DecoratorException);
    });
  });

  describe('NotFound Decorator', () => {
    it('should store controller in container with NOT_FOUND_CONTROLLER_KEY', () => {
      ControllerContainer.delete(NOT_FOUND_CONTROLLER_KEY);

      @NotFound()
      class NotFoundController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(NOT_FOUND_CONTROLLER_KEY);
      expect(config).toBeDefined();
      expect(config?.name).toBe(NotFoundController.name);
    });
  });

  describe('ServerException Decorator', () => {
    it('should store controller in container with SERVER_EXCEPTION_CONTROLLER_KEY', () => {
      ControllerContainer.delete(SERVER_EXCEPTION_CONTROLLER_KEY);

      @ServerException()
      class ServerExceptionController implements IController {
        action(): IResponse {
          return {} as IResponse;
        }
      }

      const config = ControllerContainer.get(SERVER_EXCEPTION_CONTROLLER_KEY);
      expect(config).toBeDefined();
      expect(config?.name).toBe(ServerExceptionController.name);
    });
  });
});
