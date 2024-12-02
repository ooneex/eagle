import { Exception } from '@/exception/mod.ts';
import { expect } from '@std/expect';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { ConfigDecoratorException } from './mod.ts';

Deno.test('ConfigDecoratorException - should create instance with message only', () => {
  const message = 'Test error message';
  const error = new ConfigDecoratorException(message);

  expect(error).toBeInstanceOf(ConfigDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBeNull();
});

Deno.test('ConfigDecoratorException - should create instance with message and data', () => {
  const message = 'Test error message';
  const data = { key: 'value' };
  const error = new ConfigDecoratorException(message, data);

  expect(error).toBeInstanceOf(ConfigDecoratorException);
  expect(error).toBeInstanceOf(Exception);
  expect(error.message).toBe(message);
  expect(error.status).toBe(STATUS_CODE.InternalServerError);
  expect(error.data).toBe(data);
});
