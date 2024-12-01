// deno-lint-ignore-file no-unused-vars
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { container } from '../container/mod.ts';
import { IMailer, mailer, MailerDecoratorException } from './mod.ts';

describe('mailer decorator', () => {
  it('should register mailer class correctly', () => {
    @mailer()
    class TestMailer implements IMailer {
      public send<T = boolean>(): T | Promise<T> {
        return true as T;
      }
    }

    const registeredMailer = container.get('TestMailer', 'mailer');
    expect(registeredMailer).toBeDefined();
    expect(registeredMailer).toBeInstanceOf(TestMailer);
  });

  it('should throw error when class name does not end with Mailer', () => {
    expect(() => {
      @mailer()
      // @ts-ignore: This is a test
      class InvalidName implements IMailer {
        public send<T = boolean>(): T | Promise<T> {
          return true as T;
        }
      }
    }).toThrow(MailerDecoratorException);
  });

  it('should throw error when class does not implement send method', () => {
    expect(() => {
      @mailer()
      // @ts-ignore: This is a test
      class TestMailer {
        // Missing send method
      }
    }).toThrow(MailerDecoratorException);
  });

  it('should register mailer as singleton', () => {
    @mailer()
    // @ts-ignore: This is a test
    class SingletonMailer implements IMailer {
      public send<T = boolean>(): T | Promise<T> {
        return true as T;
      }
    }

    const instance1 = container.get('SingletonMailer', 'mailer');
    const instance2 = container.get('SingletonMailer', 'mailer');
    expect(instance1).toBe(instance2);
  });
});
