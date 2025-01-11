import { beforeEach, describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  type ActionParamType,
  ControllerContainer,
  ControllerDecoratorException,
  type IController,
  Route,
} from '@/controller';
import type { IMiddleware, MiddlewareContextType } from '@/middleware';
import type { HttpResponse } from '@/response';
import { ERole } from '@/security';
import type { IValidator, ValidationResultType } from '@/validation';

describe('Controller Decorator', () => {
  beforeEach(() => {
    ControllerContainer.clear();
  });

  it('should register a valid controller class in the container', () => {
    @Route.path('/test', 'GET')
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const instance = container.get<TestController>(TestController);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestController);

    const controllers = Array.from(ControllerContainer.entries());
    expect(controllers).toHaveLength(1);
    expect(controllers[0][1].value).toBe(TestController);
    expect(controllers[0][1].path).toEqual(['/test']);
    expect(controllers[0][1].method).toEqual(['GET']);
    expect(controllers[0][1].name).toBe('TestController');
  });

  it('should register controller with multiple paths and methods', () => {
    @Route.path(['/test1', '/test2'], ['GET', 'POST'])
    class MultiController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(MultiController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test1', '/test2']);
    expect(controller?.method).toEqual(['GET', 'POST']);
  });

  it('should register controller with custom name and scope', () => {
    @Route.path('/custom', 'GET', { name: 'CustomName', scope: 'singleton' })
    class CustomController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get('CustomName');
    expect(controller).toBeDefined();
    expect(controller?.name).toBe('CustomName');

    const instance1 = container.get<CustomController>(CustomController);
    const instance2 = container.get<CustomController>(CustomController);
    expect(instance1).toBe(instance2);
  });

  it('should throw error if class does not implement IController', () => {
    expect(() => {
      @Route.path('/invalid', 'GET')
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class InvalidClass {}
    }).toThrow(ControllerDecoratorException);
  });

  it('should throw error if class name does not end with Controller', () => {
    expect(() => {
      @Route.path('/invalid', 'GET')
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class InvalidName implements IController {
        public action(): Promise<any> {
          return Promise.resolve();
        }
      }
    }).toThrow(ControllerDecoratorException);
  });

  it('should normalize paths by trimming slashes', () => {
    @Route.path('/test/', 'GET')
    class PathController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(PathController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
  });

  it('should create regexp for paths', () => {
    @Route.path('/test/:id', 'GET')
    class RegExpController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(RegExpController.name);
    expect(controller).toBeDefined();
    expect(controller?.regexp).toBeDefined();
    expect(controller?.regexp?.[0]).toBeInstanceOf(RegExp);
    expect(controller?.regexp?.[0].test('/test/123')).toBe(true);
    expect(controller?.regexp?.[0].test('/test/abc')).toBe(true);
    expect(controller?.regexp?.[0].test('/test/')).toBe(false);
    expect(controller?.regexp?.[0].test('/test')).toBe(false);
  });

  it('should accept array of paths', () => {
    @Route.path(['/test1', '/test2/'], 'GET')
    class MultiPathController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(MultiPathController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test1', '/test2']);
  });

  it('should accept array of methods', () => {
    @Route.path('/test', ['GET', 'POST'])
    class MultiMethodController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(MultiMethodController.name);
    expect(controller).toBeDefined();
    expect(controller?.method).toEqual(['GET', 'POST']);
  });

  it('should expand wildcard method to all HTTP methods', () => {
    @Route.path('/test', '*')
    class WildcardMethodController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(WildcardMethodController.name);
    expect(controller).toBeDefined();
    expect(controller?.method).toEqual([
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'HEAD',
      'OPTIONS',
    ]);
  });

  it('should register controller in singleton scope when configured', () => {
    @Route.path('/test', 'GET', { scope: 'singleton' })
    class SingletonController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const instance1 = container.get(SingletonController);
    const instance2 = container.get(SingletonController);
    expect(instance1).toBe(instance2);
  });

  it('should register controller in transient scope when configured', () => {
    @Route.path('/test', 'GET', { scope: 'transient' })
    class TransientController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const instance1 = container.get(TransientController);
    const instance2 = container.get(TransientController);
    expect(instance1).not.toBe(instance2);
  });

  it('should register controller with host restrictions', () => {
    @Route.path('/test', 'GET', { host: ['example.com', /\.example\.com$/] })
    class HostRestrictedController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(HostRestrictedController.name);
    expect(controller).toBeDefined();
    expect(controller?.host).toEqual(['example.com', /\.example\.com$/]);
  });

  it('should register controller with IP restrictions', () => {
    @Route.path('/test', 'GET', { ip: ['127.0.0.1', /^192\.168\./] })
    class IpRestrictedController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(IpRestrictedController.name);
    expect(controller).toBeDefined();
    expect(controller?.ip).toEqual(['127.0.0.1', /^192\.168\./]);
  });

  it('should register controller with validators', () => {
    class TestValidator implements IValidator {
      public validate(): ValidationResultType {
        return {
          success: true,
          details: [],
        };
      }

      public validateSync(): ValidationResultType {
        return {
          success: true,
          details: [],
        };
      }
    }

    const validator1: { scope: 'payload'; value: IValidator } = {
      scope: 'payload',
      value: new TestValidator(),
    };
    const validator2: { scope: 'payload'; value: IValidator } = {
      scope: 'payload',
      value: new TestValidator(),
    };

    @Route.path('/test', 'GET', { validators: [validator1, validator2] })
    class ValidatedController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(ValidatedController.name);
    expect(controller).toBeDefined();
    expect(controller?.validators).toEqual([validator1, validator2]);
  });

  it('should register controller with middlewares', () => {
    class TestMiddleware implements IMiddleware {
      public next(context: MiddlewareContextType): MiddlewareContextType {
        return context;
      }
    }

    const middleware1: { event: 'request'; value: IMiddleware } = {
      event: 'request',
      value: new TestMiddleware(),
    };
    const middleware2: { event: 'request'; value: IMiddleware } = {
      event: 'request',
      value: new TestMiddleware(),
    };

    @Route.path('/test', 'GET', { middlewares: [middleware1, middleware2] })
    class MiddlewareController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(MiddlewareController.name);
    expect(controller).toBeDefined();
    expect(controller?.middlewares).toEqual([middleware1, middleware2]);
  });

  it('should register controller with role restrictions', () => {
    @Route.path('/test', 'GET', { roles: [ERole.ADMIN, ERole.MASTER] })
    class RoleRestrictedController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(RoleRestrictedController.name);

    expect(controller).toBeDefined();
    expect(controller?.roles).toEqual([ERole.ADMIN, ERole.MASTER]);
  });

  it('should register middleware using middleware decorator', () => {
    class TestMiddleware implements IMiddleware {
      public next(context: MiddlewareContextType): MiddlewareContextType {
        return context;
      }
    }

    const middleware = new TestMiddleware();

    @Route.middleware('request', middleware)
    class MiddlewareDecoratorController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(
      MiddlewareDecoratorController.name,
    );
    expect(controller).toBeDefined();
    expect(controller?.middlewares).toHaveLength(1);
    expect(controller?.middlewares?.[0].event).toBe('request');
    expect(controller?.middlewares?.[0].value).toBe(middleware);
  });

  it('should register middleware with priority', () => {
    class TestMiddleware implements IMiddleware {
      public next(context: MiddlewareContextType): MiddlewareContextType {
        return context;
      }
    }

    const middleware = new TestMiddleware();

    @Route.middleware('response', middleware, { priority: 10 })
    class PriorityMiddlewareController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(
      PriorityMiddlewareController.name,
    );
    expect(controller).toBeDefined();
    expect(controller?.middlewares).toHaveLength(1);
    expect(controller?.middlewares?.[0].event).toBe('response');
    expect(controller?.middlewares?.[0].value).toBe(middleware);
    expect(controller?.middlewares?.[0].priority).toBe(10);
  });

  it('should register validator', () => {
    class TestValidator implements IValidator {
      public validate(): ValidationResultType {
        return {
          success: true,
          details: [],
        };
      }

      public validateSync(): ValidationResultType {
        return {
          success: true,
          details: [],
        };
      }
    }

    const validator = new TestValidator();

    @Route.validator('payload', validator)
    class ValidatorDecoratorController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(
      ValidatorDecoratorController.name,
    );
    expect(controller).toBeDefined();
    expect(controller?.validators).toHaveLength(1);
    expect(controller?.validators?.[0].scope).toBe('payload');
    expect(controller?.validators?.[0].value).toBe(validator);
  });

  it('should register DELETE decorator', () => {
    @Route.delete('/test')
    class DeleteController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(DeleteController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['DELETE']);
  });

  it('should register HEAD decorator', () => {
    @Route.head('/test')
    class HeadController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(HeadController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['HEAD']);
  });

  it('should register OPTIONS decorator', () => {
    @Route.options('/test')
    class OptionsController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(OptionsController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['OPTIONS']);
  });

  it('should register PATCH decorator', () => {
    @Route.patch('/test')
    class PatchController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(PatchController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['PATCH']);
  });

  it('should register POST decorator', () => {
    @Route.post('/test')
    class PostController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(PostController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['POST']);
  });

  it('should register PUT decorator', () => {
    @Route.put('/test')
    class PutController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(PutController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['PUT']);
  });

  it('should register GET decorator', () => {
    @Route.get('/test')
    class GetController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(GetController.name);
    expect(controller).toBeDefined();
    expect(controller?.path).toEqual(['/test']);
    expect(controller?.method).toEqual(['GET']);
  });

  it('should register host decorator', () => {
    @Route.host('example.com')
    class HostController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(HostController.name);
    expect(controller).toBeDefined();
    expect(controller?.host).toEqual(['example.com']);
  });

  it('should register ip decorator', () => {
    @Route.ip('127.0.0.1')
    class IpController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(IpController.name);
    expect(controller).toBeDefined();
    expect(controller?.ip).toEqual(['127.0.0.1']);
  });

  it('should register public role decorator', () => {
    @Route.role.public()
    class PublicController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(PublicController.name);
    expect(controller).toBeDefined();
    expect(controller?.roles).toEqual([]);
  });

  it('should register user role decorator', () => {
    @Route.role.user()
    class UserController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(UserController.name);
    expect(controller).toBeDefined();
    expect(controller?.roles).toEqual([ERole.USER]);
  });

  it('should register admin role decorator', () => {
    @Route.role.admin()
    class AdminController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(AdminController.name);
    expect(controller).toBeDefined();
    expect(controller?.roles).toEqual([ERole.ADMIN]);
  });

  it('should register master role decorator', () => {
    @Route.role.master()
    class MasterController implements IController {
      public action({ response }: ActionParamType): HttpResponse {
        return response;
      }
    }

    const controller = ControllerContainer.get(MasterController.name);
    expect(controller).toBeDefined();
    expect(controller?.roles).toEqual([ERole.MASTER]);
  });
});
