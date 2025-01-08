import { describe, expect, it } from 'bun:test';
import type { IConfig } from '@/config';
import { ConfigDecoratorException, config } from '@/config';
import { container } from '@/container';

describe('Config Decorator', () => {
  it('should register a valid config class in the container', () => {
    @config()
    class TestConfig implements IConfig {
      public value = 'test';

      public toJson() {
        return { value: this.value };
      }
    }

    const instance = container.get<TestConfig>(TestConfig);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestConfig);
    expect(instance.value).toBe('test');
  });

  it('should register config class with request scope', () => {
    @config({ scope: 'request' })
    class RequestScopedConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance1 = container.get<RequestScopedConfig>(RequestScopedConfig);
    const instance2 = container.get<RequestScopedConfig>(RequestScopedConfig);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register config class with transient scope', () => {
    @config({ scope: 'transient' })
    class TransientScopedConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance1 = container.get<TransientScopedConfig>(
      TransientScopedConfig,
    );
    const instance2 = container.get<TransientScopedConfig>(
      TransientScopedConfig,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register config class with singleton scope by default', () => {
    @config()
    class SingletonScopedConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance1 = container.get<SingletonScopedConfig>(
      SingletonScopedConfig,
    );
    const instance2 = container.get<SingletonScopedConfig>(
      SingletonScopedConfig,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @config()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public toJson() {
          return {};
        }
      }
    }).toThrow(ConfigDecoratorException);

    expect(() => {
      @config()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SomeConfig {
        // Missing toJson implementation
      }
    }).toThrow(ConfigDecoratorException);
  });

  it('should properly inject dependencies in config classes', () => {
    @config()
    class DependencyConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    @config()
    class InjectedConfig implements IConfig {
      constructor(public dependency: DependencyConfig) {}

      public toJson() {
        return {};
      }
    }

    const instance = container.get<InjectedConfig>(InjectedConfig);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedConfig);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyConfig);
  });
});
