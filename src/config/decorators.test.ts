import { config, ConfigDecoratorException } from '@/config/mod.ts';
import { container } from '@/container/Container.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Config Decorator', () => {
  it('should register a valid config class in the container', () => {
    // Define a test config class
    @config()
    class TestConfig {
      public value = 'test';
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
      class InvalidClass {}
    }).toThrow(ConfigDecoratorException);
  });

  it('should register config as singleton', () => {
    @config()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonConfig {}

    const instance1 = container.get('SingletonConfig');
    const instance2 = container.get('SingletonConfig');

    expect(instance1).toBe(instance2);
  });
});
