import { describe, expect, it } from 'bun:test';
import {
  STATUS_CODE,
  STATUS_TEXT,
  isClientErrorStatus,
  isErrorStatus,
  isInformationalStatus,
  isRedirectStatus,
  isServerErrorStatus,
  isStatus,
  isSuccessfulStatus,
} from '@/http/status';

describe('HTTP Status', () => {
  it('should have matching status codes and texts', () => {
    // Check that every status code has a corresponding text
    Object.values(STATUS_CODE).map((code) => {
      expect(STATUS_TEXT[code]).toBeDefined();
      expect(typeof STATUS_TEXT[code]).toBe('string');
    });
  });

  it('should have correct informational status codes (1xx)', () => {
    expect(STATUS_CODE.Continue).toBe(100);
    expect(STATUS_CODE.SwitchingProtocols).toBe(101);
    expect(STATUS_CODE.Processing).toBe(102);
    expect(STATUS_CODE.EarlyHints).toBe(103);
  });

  it('should have correct success status codes (2xx)', () => {
    expect(STATUS_CODE.OK).toBe(200);
    expect(STATUS_CODE.Created).toBe(201);
    expect(STATUS_CODE.Accepted).toBe(202);
    expect(STATUS_CODE.NoContent).toBe(204);
    expect(STATUS_CODE.ResetContent).toBe(205);
  });

  it('should have correct redirection status codes (3xx)', () => {
    expect(STATUS_CODE.MovedPermanently).toBe(301);
    expect(STATUS_CODE.Found).toBe(302);
    expect(STATUS_CODE.SeeOther).toBe(303);
    expect(STATUS_CODE.TemporaryRedirect).toBe(307);
    expect(STATUS_CODE.PermanentRedirect).toBe(308);
  });

  it('should have correct client error status codes (4xx)', () => {
    expect(STATUS_CODE.BadRequest).toBe(400);
    expect(STATUS_CODE.Unauthorized).toBe(401);
    expect(STATUS_CODE.Forbidden).toBe(403);
    expect(STATUS_CODE.NotFound).toBe(404);
    expect(STATUS_CODE.MethodNotAllowed).toBe(405);
  });

  it('should have correct server error status codes (5xx)', () => {
    expect(STATUS_CODE.InternalServerError).toBe(500);
    expect(STATUS_CODE.NotImplemented).toBe(501);
    expect(STATUS_CODE.BadGateway).toBe(502);
    expect(STATUS_CODE.ServiceUnavailable).toBe(503);
    expect(STATUS_CODE.GatewayTimeout).toBe(504);
  });

  it('should have correct status text messages', () => {
    expect(STATUS_TEXT[STATUS_CODE.OK]).toBe('OK');
    expect(STATUS_TEXT[STATUS_CODE.NotFound]).toBe('Not Found');
    expect(STATUS_TEXT[STATUS_CODE.InternalServerError]).toBe(
      'Internal Server Error',
    );
    expect(STATUS_TEXT[STATUS_CODE.Teapot]).toBe("I'm a teapot");
  });

  it('should validate HTTP status codes correctly', () => {
    // Valid status codes
    expect(isStatus(200)).toBe(true);
    expect(isStatus(404)).toBe(true);
    expect(isStatus(500)).toBe(true);

    // Invalid status codes
    expect(isStatus(0)).toBe(false);
    expect(isStatus(99)).toBe(false);
    expect(isStatus(600)).toBe(false);
    expect(isStatus(-1)).toBe(false);
  });

  it('should identify informational status codes correctly', () => {
    // Valid informational status codes
    expect(isInformationalStatus(100)).toBe(true);
    expect(isInformationalStatus(101)).toBe(true);
    expect(isInformationalStatus(102)).toBe(true);
    expect(isInformationalStatus(103)).toBe(true);

    // Invalid informational status codes
    expect(isInformationalStatus(99)).toBe(false);
    expect(isInformationalStatus(200)).toBe(false);
    expect(isInformationalStatus(404)).toBe(false);
  });

  it('should identify successful status codes correctly', () => {
    // Valid successful status codes
    expect(isSuccessfulStatus(200)).toBe(true);
    expect(isSuccessfulStatus(201)).toBe(true);
    expect(isSuccessfulStatus(204)).toBe(true);
    expect(isSuccessfulStatus(226)).toBe(true);

    // Invalid successful status codes
    expect(isSuccessfulStatus(199)).toBe(false);
    expect(isSuccessfulStatus(300)).toBe(false);
    expect(isSuccessfulStatus(404)).toBe(false);
  });

  it('should identify redirect status codes correctly', () => {
    // Valid redirect status codes
    expect(isRedirectStatus(301)).toBe(true);
    expect(isRedirectStatus(302)).toBe(true);
    expect(isRedirectStatus(307)).toBe(true);
    expect(isRedirectStatus(308)).toBe(true);

    // Invalid redirect status codes
    expect(isRedirectStatus(299)).toBe(false);
    expect(isRedirectStatus(400)).toBe(false);
    expect(isRedirectStatus(500)).toBe(false);
  });

  it('should identify client error status codes correctly', () => {
    // Valid client error status codes
    expect(isClientErrorStatus(400)).toBe(true);
    expect(isClientErrorStatus(404)).toBe(true);
    expect(isClientErrorStatus(418)).toBe(true);
    expect(isClientErrorStatus(451)).toBe(true);

    // Invalid client error status codes
    expect(isClientErrorStatus(399)).toBe(false);
    expect(isClientErrorStatus(500)).toBe(false);
    expect(isClientErrorStatus(600)).toBe(false);
  });

  it('should identify server error status codes correctly', () => {
    // Valid server error status codes
    expect(isServerErrorStatus(500)).toBe(true);
    expect(isServerErrorStatus(502)).toBe(true);
    expect(isServerErrorStatus(503)).toBe(true);
    expect(isServerErrorStatus(511)).toBe(true);

    // Invalid server error status codes
    expect(isServerErrorStatus(499)).toBe(false);
    expect(isServerErrorStatus(600)).toBe(false);
    expect(isServerErrorStatus(200)).toBe(false);
  });

  it('should identify error status codes correctly', () => {
    // Valid error status codes (both client and server)
    expect(isErrorStatus(400)).toBe(true);
    expect(isErrorStatus(404)).toBe(true);
    expect(isErrorStatus(500)).toBe(true);
    expect(isErrorStatus(503)).toBe(true);

    // Invalid error status codes
    expect(isErrorStatus(200)).toBe(false);
    expect(isErrorStatus(301)).toBe(false);
    expect(isErrorStatus(600)).toBe(false);
  });
});
