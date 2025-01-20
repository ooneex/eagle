import { describe, expect, it } from 'bun:test';
import { AbstractValidator, IsString } from '../validation';
import { dispatchControllerValidator } from './dispatchControllerValidator';

describe('dispatchControllerValidator', () => {
  class MockValidator extends AbstractValidator {
    @IsString()
    name = '';
  }

  const routeConfig = {
    validators: [
      {
        scope: 'payload',
        value: new MockValidator(),
      },
    ],
  };

  it('should pass validation when data is valid', async () => {
    const data = { name: 'hello' };
    expect(
      async () =>
        await dispatchControllerValidator({
          dataScope: 'payload',
          data,
          routeConfig: routeConfig as any,
        }),
    ).not.toThrow();
  });

  it('should throw error when data is invalid', async () => {
    const data = { name: 0 };
    expect(
      async () =>
        await dispatchControllerValidator({
          dataScope: 'payload',
          data,
          routeConfig: routeConfig as any,
        }),
    ).toThrow();
  });

  it('should pass validation for all scopes when data is valid', async () => {
    const data = { name: 'hello' };
    const routeConfigAllScopes = {
      validators: [
        {
          scope: 'payload',
          value: new MockValidator(),
        },
        {
          scope: 'query',
          value: new MockValidator(),
        },
        {
          scope: 'params',
          value: new MockValidator(),
        },
      ],
    };

    expect(
      async () =>
        await dispatchControllerValidator({
          dataScope: 'payload',
          data,
          routeConfig: routeConfigAllScopes as any,
        }),
    ).not.toThrow();

    expect(
      async () =>
        await dispatchControllerValidator({
          dataScope: 'queries',
          data,
          routeConfig: routeConfigAllScopes as any,
        }),
    ).not.toThrow();

    expect(
      async () =>
        await dispatchControllerValidator({
          dataScope: 'params',
          data,
          routeConfig: routeConfigAllScopes as any,
        }),
    ).not.toThrow();
  });
});
