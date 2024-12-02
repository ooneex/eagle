import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { DocContainer } from '../doc/mod.ts';
import {
  ContainerException,
  getDependencies,
  resolveDependencies,
} from './mod.ts';

describe('resolve', () => {
  describe('getDependencies', () => {
    it('should return empty array when no doc exists', () => {
      // Mock DocContainer.get to return null
      DocContainer.get = () => undefined;

      const result = getDependencies('NonExistentClass');
      expect(result).toEqual([]);
    });

    it('should return empty array when no constructor exists', () => {
      // @ts-ignore: trust me
      DocContainer.get = () => ({
        findConstructors: () => [],
      });

      const result = getDependencies('ClassWithoutConstructor');
      expect(result).toEqual([]);
    });

    it('should throw ContainerException on direct circular dependency', () => {
      // @ts-ignore: trust me
      DocContainer.get = () => ({
        findConstructors: () => [{
          parameters: [
            { types: ['TestClass'] },
          ],
        }],
      });

      expect(() => getDependencies('TestClass')).toThrow(ContainerException);
    });
  });

  describe('resolveDependencies', () => {
    it('should return empty array when no dependencies exist', () => {
      // @ts-ignore: trust me
      DocContainer.get = () => ({
        findConstructors: () => [],
      });

      const result = resolveDependencies('TestClass');
      expect(result).toEqual([]);
    });
  });

  it('should throw ContainerException on indirect circular dependency', () => {
    const callCount = 0;
    // @ts-ignore: trust me
    DocContainer.get = (_key: string) => ({
      findConstructors: () => [{
        parameters: [
          { types: [callCount === 0 ? 'DependentClass' : 'TestClass'] },
        ],
      }],
    });

    expect(() => getDependencies('TestClass')).toThrow(ContainerException);
  });
});
