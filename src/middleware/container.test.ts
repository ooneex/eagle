import { beforeEach, describe, expect, it } from 'bun:test';
import { MiddlewareContainer } from './container';
import type { MiddlewareEventType, MiddlewareValueType } from './types';

beforeEach(() => {
  MiddlewareContainer.clear();
  MiddlewareContainer.add('request', []);
  MiddlewareContainer.add('response', []);
  MiddlewareContainer.add('exception', []);
  MiddlewareContainer.add('kernel:init', []);
  MiddlewareContainer.add('kernel:finish', []);
});

describe('MiddlewareContainer', () => {
  it('should initialize with empty arrays for all events', () => {
    const events: MiddlewareEventType[] = ['request', 'response'];

    events.map((event) => {
      const middlewares = MiddlewareContainer.get(event);
      expect(middlewares).toBeInstanceOf(Array);
      expect(middlewares).toHaveLength(0);
    });
  });

  it('should allow adding middleware to events', () => {
    const testMiddleware: MiddlewareValueType = {
      name: 'test',
      value: () => {},
      priority: 0,
    };

    MiddlewareContainer.get('request')?.push(testMiddleware);

    expect(MiddlewareContainer.get('request')).toContain(testMiddleware);
  });

  it('should maintain separate middleware lists per event', () => {
    const testMiddleware1: MiddlewareValueType = {
      name: 'test1',
      value: () => {},
      priority: 0,
    };
    const testMiddleware2: MiddlewareValueType = {
      name: 'test2',
      value: () => {},
      priority: 0,
    };

    MiddlewareContainer.get('request')?.push(testMiddleware1);
    MiddlewareContainer.get('response')?.push(testMiddleware2);

    expect(MiddlewareContainer.get('request')).toContain(testMiddleware1);
    expect(MiddlewareContainer.get('request')).not.toContain(testMiddleware2);
    expect(MiddlewareContainer.get('response')).toContain(testMiddleware2);
    expect(MiddlewareContainer.get('response')).not.toContain(testMiddleware1);
  });
});
