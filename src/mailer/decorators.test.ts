import { describe, expect, it } from 'bun:test';
import { container } from '../container';
import { MailerDecoratorException } from './MailerDecoratorException';
import { mailer } from './decorators';
import type { IMailer } from './types';

describe('Mailer Decorator', () => {
  it('should register a valid mailer class in the container', () => {
    @mailer()
    class TestMailer implements IMailer {
      public async send<T = boolean>(): Promise<T> {
        return true as T;
      }
    }

    const instance = container.get<TestMailer>(TestMailer);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestMailer);
  });

  it('should register mailer class with transient scope', () => {
    @mailer({ scope: 'transient' })
    class TransientScopedMailer implements IMailer {
      public async send<T = boolean>(): Promise<T> {
        return true as T;
      }
    }

    const instance1 = container.get<TransientScopedMailer>(
      TransientScopedMailer,
    );
    const instance2 = container.get<TransientScopedMailer>(
      TransientScopedMailer,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register mailer class with singleton scope by default', () => {
    @mailer()
    class SingletonScopedMailer implements IMailer {
      public async send<T = boolean>(): Promise<T> {
        return true as T;
      }
    }

    const instance1 = container.get<SingletonScopedMailer>(
      SingletonScopedMailer,
    );
    const instance2 = container.get<SingletonScopedMailer>(
      SingletonScopedMailer,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @mailer()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public async send() {
          return;
        }
      }
    }).toThrow(MailerDecoratorException);

    expect(() => {
      @mailer()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SomeMailer {
        // Missing send implementation
      }
    }).toThrow(MailerDecoratorException);
  });

  it('should properly inject dependencies in mailer classes', () => {
    @mailer()
    class DependencyMailer implements IMailer {
      public async send<T = boolean>(): Promise<T> {
        return true as T;
      }
    }

    @mailer()
    class InjectedMailer implements IMailer {
      constructor(public dependency: DependencyMailer) {}

      public async send<T = boolean>(): Promise<T> {
        return true as T;
      }
    }

    const instance = container.get<InjectedMailer>(InjectedMailer);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedMailer);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyMailer);
  });
});
