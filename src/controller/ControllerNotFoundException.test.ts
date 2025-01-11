import { describe, expect, it } from 'bun:test';
import { ControllerNotFoundException } from '@/controller';
import { STATUS_CODE } from '@/http/status.ts';

describe('ControllerDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new ControllerNotFoundException(message);

    expect(exception).toBeInstanceOf(ControllerNotFoundException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.NotFound);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new ControllerNotFoundException(message, data);

    expect(exception).toBeInstanceOf(ControllerNotFoundException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.NotFound);
    expect(exception.data).toEqual(data);
  });
});
