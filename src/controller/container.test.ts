import { beforeEach, describe, expect, it } from 'bun:test';
import {
  ControllerContainer,
  type ControllerPathConfigType,
} from '@/controller';
import { HttpResponse } from '@/response/HttpResponse';

describe('ControllerContainer', () => {
  beforeEach(() => {
    // Clear the container before each test
    ControllerContainer.clear();
  });

  it('should store and retrieve controller values', () => {
    const mockController: ControllerPathConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      methods: ['GET'],
      paths: ['/test'],
      validators: [],
      middlewares: [],
    };

    // Test setting a value
    ControllerContainer.add(mockController);

    // Test getting a value
    expect(
      ControllerContainer.find((item) => item.name === mockController.name),
    ).toEqual(mockController);
  });

  it('should remove controller values', () => {
    const mockController: ControllerPathConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      methods: ['GET'],
      paths: ['/test'],
      validators: [],
      middlewares: [],
    };

    ControllerContainer.add(mockController);
    ControllerContainer.delete(mockController);

    expect(ControllerContainer.has(mockController)).toBe(false);
  });

  it('should clear all controller values', () => {
    const mockController: ControllerPathConfigType = {
      name: 'testController',
      value: {
        action: () => new HttpResponse(),
      },
      methods: ['GET'],
      paths: ['/test'],
      validators: [],
      middlewares: [],
    };

    ControllerContainer.add(mockController);
    ControllerContainer.add({ ...mockController, name: 'testController2' });

    ControllerContainer.clear();

    expect(ControllerContainer.count()).toBe(0);
  });
});
