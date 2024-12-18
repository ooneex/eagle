import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { StorageException } from './mod.ts';

describe('StorageException', () => {
  it('should create an exception with default values', () => {
    const message = 'Storage error occurred';
    const exception = new StorageException(message);

    expect(exception).toBeInstanceOf(StorageException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Storage error occurred';
    const data = { key: 'value' };
    const exception = new StorageException(message, data);

    expect(exception).toBeInstanceOf(StorageException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
