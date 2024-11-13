import { EnvConfig } from '@/config/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('EnvConfig', () => {
  let envConfig: EnvConfig;
  const mockEnvVars = {
    APP_ENV: 'development',
    APP_URL: 'http://localhost:3000',
    JWT_SECRET: 'test-secret',
    JWT_EXPIRES_IN: '24h',
    OPENAI_API_KEY: 'test-openai-key',
    OPENAI_MODEL: 'gpt-4',
    STRIPE_SECRET_KEY: 'test-stripe-key',
  };

  beforeEach(() => {
    // Set up mock environment variables
    for (const [key, value] of Object.entries(mockEnvVars)) {
      Deno.env.set(key, value);
    }
    envConfig = new EnvConfig();
  });

  afterEach(() => {
    // Clean up mock environment variables
    for (const key of Object.keys(mockEnvVars)) {
      Deno.env.delete(key);
    }
  });

  it('should load environment variables correctly', () => {
    expect(envConfig.app.env).toBe('development');
    expect(envConfig.app.url).toBe('http://localhost:3000');
    expect(envConfig.jwt.secret).toBe('test-secret');
    expect(envConfig.jwt.expiresIn).toBe('24h');
    expect(envConfig.ai.openai.key).toBe('test-openai-key');
    expect(envConfig.ai.openai.model).toBe('gpt-4');
    expect(envConfig.payment.stripe.secret).toBe('test-stripe-key');
  });

  it('should return null for undefined environment variables', () => {
    expect(envConfig.security.cors).toBe(null);
    expect(envConfig.database.url).toBe(null);
    expect(envConfig.jwt.refresh.secret).toBe(null);
    expect(envConfig.ai.mistral.key).toBe(null);
    expect(envConfig.monitoring.sentry.dsn).toBe(null);
  });

  it('should convert config to JSON correctly', () => {
    const json = envConfig.toJson();

    expect(json[EnvConfig.KEYS.app.env]).toBe('development');
    expect(json[EnvConfig.KEYS.app.url]).toBe('http://localhost:3000');
    expect(json[EnvConfig.KEYS.jwt.secret]).toBe('test-secret');
    expect(json[EnvConfig.KEYS.jwt.expiresIn]).toBe('24h');
    expect(json[EnvConfig.KEYS.ai.openai.key]).toBe('test-openai-key');
    expect(json[EnvConfig.KEYS.ai.openai.model]).toBe('gpt-4');
    expect(json[EnvConfig.KEYS.payment.stripe.secret]).toBe('test-stripe-key');

    // Check undefined values
    expect(json[EnvConfig.KEYS.security.cors]).toBe(null);
    expect(json[EnvConfig.KEYS.database.url]).toBe(null);
    expect(json[EnvConfig.KEYS.jwt.refresh.secret]).toBe(null);
  });
});
