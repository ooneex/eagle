import { describe, expect, it } from 'bun:test';
import { STATUS_CODE } from '@/http/status.ts';
import { MailerException } from '@/mailer';

describe('MailerException', () => {
  it('should create MailerException with message', () => {
    const errorMessage = 'Failed to send email';
    const exception = new MailerException(errorMessage);

    expect(exception).toBeInstanceOf(MailerException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create MailerException with message and data', () => {
    const errorMessage = 'Failed to send email';
    const errorData = {
      recipient: 'test@example.com',
      error: 'Invalid email address',
    };
    const exception = new MailerException(errorMessage, errorData);

    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(errorData);
  });

  it('should inherit stack trace functionality', () => {
    const exception = new MailerException('Test error');

    expect(exception.stacks.length).toBeGreaterThan(0);
    expect(exception.file).not.toBeNull();
    expect(typeof exception.line).toBe('number');
    expect(typeof exception.column).toBe('number');
  });

  it('should be throwable', () => {
    const throwableFunction = () => {
      throw new MailerException('Test error');
    };

    expect(throwableFunction).toThrow(MailerException);
    expect(throwableFunction).toThrow('Test error');
  });
});
