import { describe, expect, it } from 'bun:test';
import { STATUS_CODE } from '../http/status';
import { MailerDecoratorException } from './MailerDecoratorException';

describe('MailerDecoratorException', () => {
  it('should create exception with default values', () => {
    const message = 'Test error message';
    const exception = new MailerDecoratorException(message);

    expect(exception).toBeInstanceOf(MailerDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new MailerDecoratorException(message, data);

    expect(exception).toBeInstanceOf(MailerDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
