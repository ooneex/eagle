import { beforeEach, describe, expect, it } from 'bun:test';

import { HttpResponse } from '../response';
import { ControllerContainer } from './container';
import type { ControllerRouteConfigType } from './types';

describe('ControllerContainer', () => {
  beforeEach(() => {
    // Clear the container before each test
    ControllerContainer.clear();
  });

  it('should store and retrieve controller values', () => {
    const mockController: ControllerRouteConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      method: ['GET'],
      path: ['/test'],
      validators: [],
      middlewares: [],
    };

    // Test setting a value
    ControllerContainer.add(mockController.name, mockController);

    // Test getting a value
    expect(
      ControllerContainer.find((_, V) => V.name === mockController.name),
    ).toEqual({ key: mockController.name, value: mockController });
  });

  it('should remove controller values', () => {
    const mockController: ControllerRouteConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      method: ['GET'],
      path: ['/test'],
      validators: [],
      middlewares: [],
    };

    ControllerContainer.add(mockController.name, mockController);
    ControllerContainer.delete(mockController.name);

    expect(ControllerContainer.has(mockController.name)).toBe(false);
  });

  it('should clear all controller values', () => {
    const mockController: ControllerRouteConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      method: ['GET'],
      path: ['/test'],
      validators: [],
      middlewares: [],
    };

    ControllerContainer.add(mockController.name, mockController);
    ControllerContainer.add('testController2', {
      ...mockController,
      name: 'testController2',
    });

    ControllerContainer.clear();

    expect(ControllerContainer.count()).toBe(0);
  });
});
