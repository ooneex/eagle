import { Container, ContainerException } from '@/container/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Container', () => {
  it('should add and get a value', async () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default' });
    const instance = await container.get('test');

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should handle singleton instances', async () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'default', singleton: true });

    const instance1 = await container.get('test');
    const instance2 = await container.get('test');

    expect(instance1).toBeInstanceOf(TestClass);
    expect(instance2).toBeInstanceOf(TestClass);
    expect(instance1).toBe(instance2);
  });

  it('should handle scoped instances', async () => {
    const container = new Container();
    class TestClass {}

    container.add('test', TestClass, { scope: 'service' });
    const instance = await container.get('test', 'service');

    expect(instance).toBeInstanceOf(TestClass);
  });

  it('should return null for non-existent keys', async () => {
    const container = new Container();
    const result = await container.get('nonexistent');

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
});