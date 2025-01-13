import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import { ServiceDecoratorException, service } from '@/service';
import type { ScalarType } from '@/types';

describe('service decorator', () => {
  it('should throw error if class name does not end with Service', () => {
    expect(() => {
      @service()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {}
    }).toThrow(ServiceDecoratorException);

    expect(() => {
      @service()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {}
    }).toThrow(
      'Service decorator can only be used on service classes. InvalidClass must end with Service keyword.',
    );
  });

  it('should not throw error if class name ends with Service', () => {
    expect(() => {
      @service()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class ValidService {}
    }).not.toThrow();
  });

  it('should register services', () => {
    @service()
    class TestService {
      public toJson(): Record<string, ScalarType | null> {
        return {};
      }
    }

    const instance = container.get<TestService>(TestService);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestService);
  });
});
