/**
 * Environment configuration management for the application.
 * Handles loading and access to environment variables across different services.
 */

import { AppEnvType } from '../app/types.ts';
import { parseString } from '../helper/parseString.ts';
import { JwtExpiresInType } from '../jwt/types.ts';
import { ScalarType } from '../types.ts';
import { config } from './decorators.ts';
import { EnvConfigType, IConfig } from './types.ts';

/**
 * Main configuration class that manages all environment variables
 * @class EnvConfig
 * @implements {IConfig}
 */
@config()
export class EnvConfig implements IConfig {
  /**
   * Static mapping of all environment variable keys used in the application
   */
  static KEYS = {
    app: {
      env: 'APP_ENV',
      url: 'APP_URL',
      port: 'APP_PORT',
      host: 'APP_HOST',
      isLocal: 'isLocal',
      isTesting: 'isTesting',
      isDevelopment: 'isDevelopment',
      isStaging: 'isStaging',
      isProduction: 'isProduction',
    },
    security: {
      cors: 'CORS_ALLOW_ORIGIN',
    },
    database: {
      url: 'DATABASE_URL',
    },
    jwt: {
      secret: 'JWT_SECRET',
      expiresIn: 'JWT_EXPIRES_IN',
      refresh: {
        secret: 'JWT_REFRESH_SECRET',
        expiresIn: 'JWT_REFRESH_EXPIRES_IN',
      },
    },
    ai: {
      openai: {
        key: 'OPENAI_API_KEY',
        model: 'OPENAI_MODEL',
      },
      mistral: {
        key: 'MISTRAL_API_KEY',
        model: 'MISTRAL_MODEL',
      },
      groq: {
        key: 'GROQ_API_KEY',
        model: 'GROQ_MODEL',
      },
      gemini: {
        key: 'GEMINI_API_KEY',
        model: 'GEMINI_MODEL',
      },
      llama: {
        key: 'LLAMA_API_KEY',
        model: 'LLAMA_MODEL',
      },
      anthropic: {
        key: 'ANTHROPIC_API_KEY',
        model: 'ANTHROPIC_MODEL',
      },
    },
    monitoring: {
      sentry: {
        dsn: 'SENTRY_DSN',
        token: 'SENTRY_AUTH_TOKEN',
      },
    },
    storage: {
      cloudflare: {
        key: {
          secret: 'CLOUDFLARE_SECRET_KEY',
          access: 'CLOUDFLARE_ACCESS_KEY',
        },
        endpoint: 'CLOUDFLARE_ENDPOINT',
        public: 'CLOUDFLARE_PUBLIC_ENDPOINT',
      },
    },
    mailer: {
      dev: {
        url: 'MAILER_DEV_URL',
      },
      brevo: {
        key: 'BREVO_API_KEY',
      },
    },
    payment: {
      stripe: {
        secret: 'STRIPE_SECRET_KEY',
      },
    },
  };

  /**
   * Application environment configuration
   */
  public readonly app: EnvConfigType['app'] = {
    env: (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) ?? null,
    url: Deno.env.get(EnvConfig.KEYS.app.url) ?? null,
    port:
      parseString<number>(Deno.env.get(EnvConfig.KEYS.app.port) as string) ??
        null,
    host: Deno.env.get(EnvConfig.KEYS.app.host) ?? null,
    isLocal: (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) === 'local',
    isTesting: (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) === 'test',
    isDevelopment:
      (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) === 'development',
    isStaging:
      (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) === 'staging',
    isProduction:
      (Deno.env.get(EnvConfig.KEYS.app.env) as AppEnvType) === 'production',
  };

  /**
   * Security configuration including CORS settings
   */
  public readonly security: EnvConfigType['security'] = {
    cors: Deno.env.get(EnvConfig.KEYS.security.cors) ?? null,
  };

  /**
   * Database connection configuration
   */
  public readonly database: EnvConfigType['database'] = {
    url: Deno.env.get(EnvConfig.KEYS.database.url) ?? null,
  };

  /**
   * JWT authentication configuration
   */
  public readonly jwt: EnvConfigType['jwt'] = {
    secret: Deno.env.get(EnvConfig.KEYS.jwt.secret) ?? null,
    expiresIn:
      (Deno.env.get(EnvConfig.KEYS.jwt.expiresIn) as JwtExpiresInType) ?? null,
    refresh: {
      secret: Deno.env.get(EnvConfig.KEYS.jwt.refresh.secret) ?? null,
      expiresIn: (Deno.env.get(
        EnvConfig.KEYS.jwt.refresh.expiresIn,
      ) as JwtExpiresInType) ?? null,
    },
  };

  /**
   * AI service configurations
   */
  public readonly ai: EnvConfigType['ai'] = {
    openai: {
      key: Deno.env.get(EnvConfig.KEYS.ai.openai.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.openai.model) ?? null,
    },
    mistral: {
      key: Deno.env.get(EnvConfig.KEYS.ai.mistral.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.mistral.model) ?? null,
    },
    groq: {
      key: Deno.env.get(EnvConfig.KEYS.ai.groq.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.groq.model) ?? null,
    },
    gemini: {
      key: Deno.env.get(EnvConfig.KEYS.ai.gemini.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.gemini.model) ?? null,
    },
    llama: {
      key: Deno.env.get(EnvConfig.KEYS.ai.llama.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.llama.model) ?? null,
    },
    anthropic: {
      key: Deno.env.get(EnvConfig.KEYS.ai.anthropic.key) ?? null,
      model: Deno.env.get(EnvConfig.KEYS.ai.anthropic.model) ?? null,
    },
  };

  /**
   * Monitoring service configuration
   */
  public readonly monitoring: EnvConfigType['monitoring'] = {
    sentry: {
      dsn: Deno.env.get(EnvConfig.KEYS.monitoring.sentry.dsn) ?? null,
      token: Deno.env.get(EnvConfig.KEYS.monitoring.sentry.token) ?? null,
    },
  };

  /**
   * Storage service configuration
   */
  public readonly storage: EnvConfigType['storage'] = {
    cloudflare: {
      key: {
        secret: Deno.env.get(EnvConfig.KEYS.storage.cloudflare.key.secret) ??
          null,
        access: Deno.env.get(EnvConfig.KEYS.storage.cloudflare.key.access) ??
          null,
      },
      endpoint: Deno.env.get(EnvConfig.KEYS.storage.cloudflare.endpoint) ??
        null,
      public: Deno.env.get(EnvConfig.KEYS.storage.cloudflare.public) ?? null,
    },
  };

  /**
   * Email service configuration
   */
  public readonly mailer: EnvConfigType['mailer'] = {
    dev: {
      url: Deno.env.get(EnvConfig.KEYS.mailer.dev.url) ?? null,
    },
    brevo: {
      key: Deno.env.get(EnvConfig.KEYS.mailer.brevo.key) ?? null,
    },
  };

  /**
   * Payment processing configuration
   */
  public readonly payment: EnvConfigType['payment'] = {
    stripe: {
      secret: Deno.env.get(EnvConfig.KEYS.payment.stripe.secret) ?? null,
    },
  };

  /**
   * Converts the configuration to a JSON format
   * @returns {Record<string, ScalarType | null>} Configuration as JSON
   */
  public toJson(): Record<string, ScalarType | null> {
    return {
      [EnvConfig.KEYS.app.env]: this.app.env,
      [EnvConfig.KEYS.app.url]: this.app.url,
      [EnvConfig.KEYS.app.port]: this.app.port,
      [EnvConfig.KEYS.app.host]: this.app.host,
      isLocal: this.app.isLocal,
      isTesting: this.app.isTesting,
      isDevelopment: this.app.isDevelopment,
      isStaging: this.app.isStaging,
      isProduction: this.app.isProduction,
      [EnvConfig.KEYS.security.cors]: this.security.cors,
      [EnvConfig.KEYS.database.url]: this.database.url,
      [EnvConfig.KEYS.jwt.secret]: this.jwt.secret,
      [EnvConfig.KEYS.jwt.expiresIn]: this.jwt.expiresIn,
      [EnvConfig.KEYS.jwt.refresh.secret]: this.jwt.refresh.secret,
      [EnvConfig.KEYS.jwt.refresh.expiresIn]: this.jwt.refresh.expiresIn,
      [EnvConfig.KEYS.ai.openai.key]: this.ai.openai.key,
      [EnvConfig.KEYS.ai.openai.model]: this.ai.openai.model,
      [EnvConfig.KEYS.ai.mistral.key]: this.ai.mistral.key,
      [EnvConfig.KEYS.ai.mistral.model]: this.ai.mistral.model,
      [EnvConfig.KEYS.ai.groq.key]: this.ai.groq.key,
      [EnvConfig.KEYS.ai.groq.model]: this.ai.groq.model,
      [EnvConfig.KEYS.ai.anthropic.key]: this.ai.anthropic.key,
      [EnvConfig.KEYS.ai.anthropic.model]: this.ai.anthropic.model,
      [EnvConfig.KEYS.ai.gemini.key]: this.ai.gemini.key,
      [EnvConfig.KEYS.ai.gemini.model]: this.ai.gemini.model,
      [EnvConfig.KEYS.ai.llama.key]: this.ai.llama.key,
      [EnvConfig.KEYS.ai.llama.model]: this.ai.llama.model,
      [EnvConfig.KEYS.monitoring.sentry.dsn]: this.monitoring.sentry.dsn,
      [EnvConfig.KEYS.monitoring.sentry.token]: this.monitoring.sentry.token,
      [EnvConfig.KEYS.storage.cloudflare.key.secret]:
        this.storage.cloudflare.key.secret,
      [EnvConfig.KEYS.storage.cloudflare.key.access]:
        this.storage.cloudflare.key.access,
      [EnvConfig.KEYS.storage.cloudflare.endpoint]:
        this.storage.cloudflare.endpoint,
      [EnvConfig.KEYS.storage.cloudflare.public]:
        this.storage.cloudflare.public,
      [EnvConfig.KEYS.mailer.dev.url]: this.mailer.dev.url,
      [EnvConfig.KEYS.mailer.brevo.key]: this.mailer.brevo.key,
      [EnvConfig.KEYS.payment.stripe.secret]: this.payment.stripe.secret,
    };
  }
}
