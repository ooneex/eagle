import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { ControllerContainer, StoreControllerValueType } from './mod.ts';

describe('ControllerContainer', () => {
  beforeEach(() => {
    // Clear the container before each test
    ControllerContainer.clear();
  });

  it('should store and retrieve controller values', () => {
    const mockController: StoreControllerValueType = {
      name: 'testController',
      // Add other required properties based on StoreControllerValueType
    };

    // Test setting a value
    ControllerContainer.add('test-key', mockController);

    // Test getting a value
    expect(ControllerContainer.get('test-key')).toBe(mockController);
  });

  it('should remove controller values', () => {
    const mockController: StoreControllerValueType = {
      name: 'testController',
    };

    ControllerContainer.add('test-key', mockController);
    ControllerContainer.delete('test-key');

    expect(ControllerContainer.has('test-key')).toBe(false);
  });

  it('should clear all controller values', () => {
    const mockController: StoreControllerValueType = {
      name: 'testController',
    };

    ControllerContainer.add('test-key1', mockController);
    ControllerContainer.add('test-key2', mockController);

    ControllerContainer.clear();

    expect(ControllerContainer.count()).toBe(0);
  });
});
