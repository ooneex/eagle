import { describe, expect, it } from 'bun:test';
import { UnauthorizedException } from './UnauthorizedException';

describe('UnauthorizedException', () => {
  it('should create an instance with the correct message and status', () => {
    const message = 'Unauthorized access';
    const exception = new UnauthorizedException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(401); // Assuming 401 is the status code for Unauthorized
    expect(exception.data).toBeNull();
  });

  it('should create an instance with the correct data', () => {
    const message = 'Unauthorized access';
    const data = { userId: 123 };
    const exception = new UnauthorizedException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(401);
    expect(exception.data).toEqual(data);
  });
});
