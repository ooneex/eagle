import { describe, expect, it } from 'bun:test';
import { Container, injectable } from 'inversify';
import 'reflect-metadata';
import { container } from './container';

describe('Container', () => {
  it('should be a valid Container instance', () => {
    expect(container).toBeDefined();
    expect(container).toBeInstanceOf(Container);
  });

  it('should have singleton scope as default', () => {
    class TestClass {}
    container.bind(TestClass).toSelf();

    const instance1 = container.get(TestClass);
    const instance2 = container.get(TestClass);

    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should maintain singleton instances across the container', () => {
    class SingletonClass {}
    container.bind(SingletonClass).toSelf().inSingletonScope();

    const instance1 = container.get(SingletonClass);
    const instance2 = container.get(SingletonClass);

    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should properly inject dependencies', () => {
    @injectable()
    class DependencyClass {}

    @injectable()
    class InjectedClass {
      constructor(public dependency: DependencyClass) {}
    }

    container.bind(DependencyClass).toSelf();
    container.bind(InjectedClass).toSelf();

    const instance = container.get(InjectedClass);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedClass);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyClass);
  });
});
