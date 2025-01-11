import { describe, expect, it } from 'bun:test';
import { ServiceDecoratorException, service } from '@/service';

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
});
