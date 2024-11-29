import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { VectorDatabaseException } from '../mod.ts';

describe('VectorDatabaseException', () => {
  it('should create an exception with default values', () => {
    const message = 'Vector database error';
    const exception = new VectorDatabaseException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Vector database error';
    const data = { operation: 'embedding', error: 'Invalid dimensions' };
    const exception = new VectorDatabaseException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should extend Exception class', () => {
    const exception = new VectorDatabaseException('Test error');
    expect(exception).toBeInstanceOf(Error);
  });
});
