import { expect } from 'jsr:@std/expect';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { describe, it } from 'jsr:@std/testing/bdd';
import { ControllerActionException } from './mod.ts';

describe('ControllerActionException', () => {
  it('should create an exception with the correct message and status code', () => {
    const message = 'An error occurred';
    const exception = new ControllerActionException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
  });

  it('should handle data correctly', () => {
    const message = 'An error occurred';
    const data = { key: 'value' };
    const exception = new ControllerActionException(message, data);

    expect(exception.data).toEqual(data);
  });
});
