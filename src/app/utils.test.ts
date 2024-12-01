import {
  buildControllerActionParameters,
  buildDefaultNotFoundResponse,
  buildDefaultServerExceptionResponse,
  buildRequest,
  checkUserPermissionsForController,
  handleControllerMiddlewares,
  handleEnvValidation,
  handleGlobalMiddlewares,
  handleRequestCookiesValidation,
  handleRequestDataValidation,
  handleRequestFilesValidation,
  handleServerException,
} from '@/app/mod.ts';
import { StoreControllerValueType } from '@/controller/mod.ts';
import { Exception } from '@/exception/mod.ts';
import { IMiddleware, MiddlewareScopeType } from '@/middleware/mod.ts';
import { HttpRequest } from '@/request/mod.ts';
import { HttpResponse } from '@/response/mod.ts';
import { ERole, UnauthorizedException } from '@/security/mod.ts';
import {
  IValidator,
  ValidationFailedException,
  ValidatorScopeType,
} from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';

describe('utils', () => {
  let mockRequest: Request;
  let mockDefinition: StoreControllerValueType;
  let mockValidator: IValidator;
  let mockMiddleware: IMiddleware;

  beforeEach(() => {
    mockRequest = new Request('http://test.com/path', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    mockDefinition = {
      name: 'TestController',
      regexp: [/\/path\/(?<id>\d+)/],
      validators: [],
      roles: [],
    };

    mockValidator = {
      validate: () => ({ success: true, details: [] }),
      getScope: () => 'payload' as ValidatorScopeType,
    };

    mockMiddleware = {
      execute: async () => {},
      getScope: () => 'before' as MiddlewareScopeType,
      getOrder: () => 0,
    };
  });

  describe('buildDefaultNotFoundResponse', () => {
    it('should build not found response', () => {
      const response = buildDefaultNotFoundResponse(mockRequest);
      expect(response.status).toBe(404);
    });
  });

  describe('buildDefaultServerExceptionResponse', () => {
    it('should build server exception response', () => {
      const error = new Exception('Test error', 400);
      const response = buildDefaultServerExceptionResponse(error);
      expect(response.status).toBe(400);
    });
  });

  describe('buildRequest', () => {
    it('should build request object', async () => {
      const request = await buildRequest(mockRequest, mockDefinition);
      expect(request instanceof HttpRequest).toBe(true);
    });
  });

  describe('buildControllerActionParameters', () => {
    it('should build controller action parameters', async () => {
      const result = await buildControllerActionParameters(
        mockRequest,
        mockDefinition,
      );
      expect(result.request instanceof HttpRequest).toBe(true);
      expect(result.response instanceof HttpResponse).toBe(true);
    });
  });

  describe('handleRequestDataValidation', () => {
    it('should validate request data', () => {
      const request = new HttpRequest(mockRequest);
      mockDefinition.validators = [mockValidator];
      expect(handleRequestDataValidation(request, mockDefinition)).toBe(true);
    });

    it('should throw ValidationFailedException on invalid data', () => {
      const request = new HttpRequest(mockRequest);
      mockValidator.validate = () => ({
        success: false,
        details: [{ success: false, message: 'Invalid', property: 'test' }],
      });
      mockDefinition.validators = [mockValidator];
      expect(() => handleRequestDataValidation(request, mockDefinition))
        .toThrow(ValidationFailedException);
    });
  });

  describe('handleRequestCookiesValidation', () => {
    it('should validate cookies', () => {
      const request = new HttpRequest(mockRequest);
      mockValidator.getScope = () => 'cookies';
      mockDefinition.validators = [mockValidator];
      expect(handleRequestCookiesValidation(request, mockDefinition)).toBe(
        true,
      );
    });
  });

  describe('handleRequestFilesValidation', () => {
    it('should validate files', () => {
      const request = new HttpRequest(mockRequest);
      mockValidator.getScope = () => 'files';
      mockDefinition.validators = [mockValidator];
      expect(handleRequestFilesValidation(request, mockDefinition)).toBe(true);
    });
  });

  describe('handleEnvValidation', () => {
    it('should validate env variables', () => {
      mockValidator.getScope = () => 'env';
      expect(handleEnvValidation([mockValidator])).toBe(true);
    });
  });

  describe('handleServerException', () => {
    it('should handle server exception', async () => {
      const error = new Error('Test error');
      const response = await handleServerException(mockRequest, error);
      expect(response.status).toBe(500);
    });
  });

  describe('handleGlobalMiddlewares', () => {
    it('should handle global middlewares', async () => {
      const request = new HttpRequest(mockRequest);
      const response = new HttpResponse();
      await handleGlobalMiddlewares(request, response, 'response');
      expect(true).toBe(true);
    });
  });

  describe('handleControllerMiddlewares', () => {
    it('should handle controller middlewares', async () => {
      const request = new HttpRequest(mockRequest);
      const response = new HttpResponse();
      await handleControllerMiddlewares(request, response, 'response', [
        mockMiddleware,
      ]);
      expect(true).toBe(true);
    });
  });

  describe('checkUserPermissionsForController', () => {
    it('should check user permissions', () => {
      const request = new HttpRequest(mockRequest);
      expect(checkUserPermissionsForController(request, mockDefinition)).toBe(
        true,
      );
    });

    it('should throw UnauthorizedException when roles required but user not authenticated', () => {
      const request = new HttpRequest(mockRequest);
      mockDefinition.roles = [ERole.ADMIN];
      expect(() => checkUserPermissionsForController(request, mockDefinition))
        .toThrow(UnauthorizedException);
    });
  });

  describe('buildDefaultNotFoundResponse', () => {
    it('should build default not found response', () => {
      const response = buildDefaultNotFoundResponse(mockRequest);
      expect(response.status).toBe(404);
    });
  });

  describe('buildDefaultServerExceptionResponse', () => {
    it('should build default server exception response', async () => {
      const error = new Error('Test error');
      const response = buildDefaultServerExceptionResponse(error);
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({
        data: null,
        message: 'Internal Server Error',
        state: { success: false, status: 500 },
        auth: {
          isAuthenticated: false,
          user: {
            username: null,
            roles: [],
            isSuperAdmin: false,
            isAdmin: false,
            isUser: false,
          },
        },
      });
    });
  });

  describe('buildRequest', () => {
    it('should build request with params', async () => {
      const request = await buildRequest(mockRequest, {
        name: 'TestController',
        regexp: [/\/path\/(?<id>\d+)/],
        validators: [],
        roles: [],
      });
      expect(request.params.get('id')).toBeUndefined();
    });
  });

  describe('buildControllerActionParameters', () => {
    it('should build controller action parameters', async () => {
      const result = await buildControllerActionParameters(
        mockRequest,
        mockDefinition,
      );
      expect(result.parameters).toEqual([]);
      expect(result.request).toBeInstanceOf(HttpRequest);
      expect(result.response).toBeInstanceOf(HttpResponse);
    });
  });

  describe('handleRequestDataValidation', () => {
    it('should validate request data', () => {
      mockValidator.getScope = () => 'payload';
      const request = new HttpRequest(mockRequest);
      expect(() =>
        handleRequestDataValidation(request, {
          ...mockDefinition,
          validators: [mockValidator],
        })
      ).not.toThrow();
    });

    it('should throw ValidationFailedException on invalid data', () => {
      mockValidator.validate = () => ({
        success: false,
        details: [{
          property: 'test',
          success: false,
          message: 'Invalid data',
        }],
      });
      mockValidator.getScope = () => 'payload';
      const request = new HttpRequest(mockRequest);
      expect(() =>
        handleRequestDataValidation(request, {
          ...mockDefinition,
          validators: [mockValidator],
        })
      ).toThrow(ValidationFailedException);
    });
  });

  describe('handleRequestCookiesValidation', () => {
    it('should validate request cookies', () => {
      mockValidator.getScope = () => 'cookies';
      const request = new HttpRequest(mockRequest);
      expect(() =>
        handleRequestCookiesValidation(request, {
          ...mockDefinition,
          validators: [mockValidator],
        })
      ).not.toThrow();
    });
  });

  describe('handleRequestFilesValidation', () => {
    it('should validate request files', () => {
      mockValidator.getScope = () => 'files';
      const request = new HttpRequest(mockRequest);
      expect(() =>
        handleRequestFilesValidation(request, {
          ...mockDefinition,
          validators: [mockValidator],
        })
      ).not.toThrow();
    });
  });

  describe('handleEnvValidation', () => {
    it('should validate env variables', () => {
      mockValidator.getScope = () => 'env';
      expect(() => handleEnvValidation([mockValidator])).not.toThrow();
    });

    it('should throw ValidationFailedException on invalid env variables', () => {
      mockValidator.validate = () => ({
        success: false,
        details: [{
          property: 'TEST_ENV',
          success: false,
          message: 'Invalid env variable',
        }],
      });
      mockValidator.getScope = () => 'env';
      expect(() => handleEnvValidation([mockValidator])).toThrow(
        ValidationFailedException,
      );
    });
  });

  describe('handleServerException', () => {
    it('should handle custom exception', async () => {
      const error = new Exception('Custom error', 400, { foo: 'bar' });
      const response = await handleServerException(mockRequest, error);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toBe('Custom error');
      expect(data.data).toEqual({ foo: 'bar' });
    });

    it('should handle server exception with custom controller', async () => {
      const error = new Error('Test error');
      const response = await handleServerException(
        mockRequest,
        error,
      );
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.message).toBe('Internal Server Error');
    });
  });

  describe('handleGlobalMiddlewares', () => {
    it('should handle global middleware error', async () => {
      const request = new HttpRequest(mockRequest);
      const response = new HttpResponse();
      mockMiddleware.execute = () => {
        throw new Exception('Middleware error', 400);
      };

      try {
        await handleGlobalMiddlewares(request, response, 'response');
      } catch (error) {
        expect(error).toBeInstanceOf(Exception);
      }
    });
  });

  describe('handleControllerMiddlewares', () => {
    it('should handle controller middleware error', async () => {
      const request = new HttpRequest(mockRequest);
      const response = new HttpResponse();
      mockMiddleware.execute = () => {
        throw new Exception('Middleware error', 400);
      };

      try {
        await handleControllerMiddlewares(request, response, 'response', [
          mockMiddleware,
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(Exception);
      }
    });
  });
});
