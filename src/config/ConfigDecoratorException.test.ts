import { describe, expect } from 'bun:test';
import { Exception } from '../exception';
import { STATUS_CODE } from '../http/status';
import { ConfigDecoratorException } from './ConfigDecoratorException';

describe('ConfigDecoratorException - should create instance with message only', () => {
  const message = 'Test error message';
  const error = new ConfigDecoratorException(message);

  expect(error).toBeInstanceOf(ConfigDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBeNull();
});

describe('ConfigDecoratorException - should create instance with message and data', () => {
  const message = 'Test error message';
  const data = { key: 'value' };
  const error = new ConfigDecoratorException(message, data);

  expect(error).toBeInstanceOf(ConfigDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBe(data);
});
