import {
  buildControllerActionParameters,
  buildDefaultNotFoundResponse,
  buildDefaultServerExceptionResponse,
  buildRequest,
} from '@/app/utils.ts';
import { DocContainer } from '@/doc/container.ts';
import { Exception } from '@/exception/Exception.ts';
import { HttpRequest } from '@/request/HttpRequest.ts';
import { HttpResponse } from '@/response/HttpResponse.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('utils', () => {
  describe('buildDefaultNotFoundResponse', () => {
    it('should build a 404 response with correct details', async () => {
      const mockRequest = new Request('http://example.com/missing-path');
      const response = buildDefaultNotFoundResponse(mockRequest);
      const body = await response.json();
      expect(response.status).toBe(404);

      expect(body).toEqual({
        data: {
          path: '/missing-path',
          method: 'GET',
          ip: null,
          host: null,
        },
        message: 'Route /missing-path with GET method not found',
        state: {
          success: false,
          status: 404,
        },
      });
    });
  });

  describe('buildDefaultServerExceptionResponse', () => {
    it('should build a 500 response for regular Error', async () => {
      const error = new Error('Test error');
      const response = buildDefaultServerExceptionResponse(error);
      const body = await response.json();
      expect(response.status).toBe(500);
      expect(body).toEqual({
        data: null,
        message: 'Internal Server Error',
        state: { success: false, status: 500 },
      });
    });

    it('should use custom status and message for Exception', async () => {
      const error = new Exception('Custom error', 400);
      const response = buildDefaultServerExceptionResponse(error);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({
        data: null,
        message: 'Custom error',
        state: { success: false, status: 400 },
      });
    });
  });

  describe('buildRequest', () => {
    it('should build request with params from regexp match', async () => {
      const mockRequest = new Request('http://example.com/users/123');
      const definition = {
        name: 'TestController',
        regexp: [/\/users\/(?<id>\d+)/],
      };

      const request = await buildRequest(mockRequest, definition);

      expect(request.params.get('id')).toEqual(123);
    });

    it('should handle JSON payload', async () => {
      const payload = { name: 'test' };
      const mockRequest = new Request('http://example.com/api', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const definition = { name: 'TestController', regexp: [] };

      const request = await buildRequest(mockRequest, definition);

      expect(request.payload.toJson()).toEqual(payload);
    });
  });

  describe('buildControllerActionParameters', () => {
    let originalGet: typeof DocContainer.get;

    beforeEach(() => {
      originalGet = DocContainer.get;
    });

    afterEach(() => {
      DocContainer.get = originalGet;
    });

    it('should build parameters with basic dependencies', async () => {
      const mockRequest = new Request('http://example.com/api');
      const definition = {
        name: 'TestController',
        regexp: [],
      };

      // Mock DocContainer
      const mockDocContainer = {
        findParameters: () => [
          { name: 'req', types: ['IRequest'] },
          { name: 'res', types: ['IResponse'] },
        ],
      };
      DocContainer.get = () => mockDocContainer as any;

      const parameters = await buildControllerActionParameters(
        mockRequest,
        definition,
      );

      expect(parameters.length).toBe(2);
      expect(parameters[0]).toBeInstanceOf(HttpRequest);
      expect(parameters[1]).toBeInstanceOf(HttpResponse);
    });

    it('should throw ControllerActionException for unknown dependency', async () => {
      const mockRequest = new Request('http://example.com/api');
      const definition = {
        name: 'TestController',
        regexp: [],
      };

      // Mock DocContainer directly
      DocContainer.get = () =>
        ({
          findParameters: () => [
            { name: 'unknown', types: ['UnknownType'] },
          ],
        }) as any;

      try {
        await buildControllerActionParameters(mockRequest, definition);
        throw new Error('Expected to throw ControllerActionException');
      } catch (error) {
        expect((error as Exception).message).toContain(
          'Dependency UnknownType not found',
        );
      }
    });
  });
});
