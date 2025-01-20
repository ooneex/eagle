import { describe, expect } from 'bun:test';
import { Exception } from '../exception/Exception';
import { STATUS_CODE } from '../http/status';
import { CommandDecoratorException } from './CommandDecoratorException';

describe('CommandDecoratorException - should create instance with message only', () => {
  const message = 'Test error message';
  const error = new CommandDecoratorException(message);

  expect(error).toBeInstanceOf(CommandDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBeNull();
});

describe('CommandDecoratorException - should create instance with message and data', () => {
  const message = 'Test error message';
  const data = { key: 'value' };
  const error = new CommandDecoratorException(message, data);

  expect(error).toBeInstanceOf(CommandDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBe(data);
});
