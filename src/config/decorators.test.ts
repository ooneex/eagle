import { config, ConfigDecoratorException, IConfig } from '@/config/mod.ts';
import { container } from '@/container/Container.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Config Decorator', () => {
  it('should register a valid config class in the container', () => {
    // Define a test config class
    @config()
    class TestConfig implements IConfig {
      public value = 'test';

      public toJson() {
        return { value: this.value };
      }
    }

    // Verify the class was registered in the container
    const instance = container.get<TestConfig>('TestConfig', 'config');
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestConfig);
    expect(instance?.value).toBe('test');
  });

  it('should throw ConfigDecoratorException for non-config class names', () => {
    expect(() => {
      @config()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass implements IConfig {
        public toJson() {
          return {};
        }
      }
    }).toThrow(ConfigDecoratorException);
  });

  it('should register config as singleton', () => {
    @config()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance1 = container.get('SingletonConfig', 'config');
    const instance2 = container.get('SingletonConfig', 'config');

    expect(instance1).toBe(instance2);
  });

  it('should throw error if toJson method is not defined', () => {
    expect(() => {
      @config()
      // @ts-ignore: Testing runtime behavior
      // deno-lint-ignore no-unused-vars
      class InvalidConfig {
        // No toJson method
      }
    }).toThrow(ConfigDecoratorException);
  });

  it('should throw error if class does not end with Config keyword', () => {
    expect(() => {
      @config()
      // @ts-ignore: Testing runtime behavior
      // deno-lint-ignore no-unused-vars
      class InvalidConfigInvalid {
        public toJson() {
          return {};
        }
      }
    }).toThrow(ConfigDecoratorException);
  });

  it('should register config with custom scope', () => {
    @config({ scope: 'config' })
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class CustomScopeConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance = container.get('CustomScopeConfig', 'config');
    expect(instance).toBeDefined();
  });

  it('should register non-singleton config', () => {
    @config({ singleton: false })
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class NonSingletonConfig implements IConfig {
      public toJson() {
        return {};
      }
    }

    const instance1 = container.get('NonSingletonConfig', 'config');
    const instance2 = container.get('NonSingletonConfig', 'config');

    expect(instance1).not.toBe(instance2);
  });
});
