import { Container, ContainerException } from '@/container/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Container', () => {
  it('should add and get a value', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default' });
    const instance = container.get('test', 'default');

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should handle singleton instances', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default', singleton: true });

    const instance1 = container.get('test', 'default');
    const instance2 = container.get('test', 'default');

    expect(instance1).toBeInstanceOf(TestClass);
    expect(instance2).toBeInstanceOf(TestClass);
    expect(instance1).toBe(instance2);
  });

  it('should handle scoped instances', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'service' });
    const instance = container.get('test', 'service');

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should return null for non-existent keys', () => {
    const container = new Container();
    const result = container.get('nonexistent');

    expect(result).toBe(null);
  });

  it('should throw when adding duplicate keys in same scope', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default' });

    expect(() => container.add('test', TestClass, { scope: 'default' }))
      .toThrow(
        ContainerException,
      );
  });

  it('should allow same key in different scopes', () => {
    const container = new Container();
    class TestClass {}
    class OtherClass {}

    container.add('test', TestClass, { scope: 'service' });
    container.add('test', OtherClass, { scope: 'repository' });

    expect(container).toBeDefined();
  });

  it('should return store for given scope', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'service' });
    const store = container.getStore('service');

    expect(store).toBeDefined();
    expect(store?.has('test')).toBe(true);
  });

  it('should return undefined for non-existent scope', () => {
    const container = new Container();
    const store = container.getStore('service');

    expect(store).toBeUndefined();
  });

  it('should handle instance option correctly', () => {
    const container = new Container();
    const instance = { foo: 'bar' };

    container.add('test', instance, { instance: true, singleton: true });
    const result = container.get('test');

    expect(result).toBe(instance);
  });

  it('should create new instances when singleton is false', () => {
    const container = new Container();
    class TestClass {
      public value: number;
      constructor() {
        this.value = Math.random();
      }
    }

    container.add('test', TestClass, { singleton: false });

    const instance1 = container.get('test');
    const instance2 = container.get('test');

    expect(instance1).not.toBe(instance2);
  });

  it('should get instance with specific scope', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default' });
    const result = container.get('test', 'default');

    expect(result).toBeInstanceOf(TestClass);
  });

  it('should return null when getting from wrong scope', () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default' });
    // @ts-expect-error: This is a test
    const result = container.get('test', 'different');

    expect(result).toBe(null);
  });
});
