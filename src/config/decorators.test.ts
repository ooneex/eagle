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
    const instance = container.get<TestConfig>('TestConfig');
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

    const instance1 = container.get('SingletonConfig');
    const instance2 = container.get('SingletonConfig');

    expect(instance1).toBe(instance2);
  });
});
