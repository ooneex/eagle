import { describe, expect, it } from 'bun:test';
import { STATUS_CODE } from '@std/http/status';

import { ControllerDecoratorException } from './ControllerDecoratorException';

describe('ControllerDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new ControllerDecoratorException(message);

    expect(exception).toBeInstanceOf(ControllerDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new ControllerDecoratorException(message, data);

    expect(exception).toBeInstanceOf(ControllerDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
