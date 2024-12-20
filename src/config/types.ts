/**
 * @fileoverview Environment configuration types and interfaces
 */

import { AppEnvType } from '../app/types.ts';
import { JwtExpiresInType } from '../jwt/types.ts';
import { ScalarType } from '../types.ts';

/**
 * Type definition for environment configuration
 */
export type EnvConfigType = {
  /** Application configuration */
  app: {
    /** Environment type */
    env: AppEnvType | null;
    /** Application URL */
    url: string | null;
    /** Port number */
    port: number | null;
    /** Host name */
    host: string | null;
    /** Whether running locally */
    isLocal: boolean;
    /** Whether in testing mode */
    isTesting: boolean;
    /** Whether in development mode */
    isDevelopment: boolean;
    /** Whether in staging mode */
    isStaging: boolean;
    /** Whether in production mode */
    isProduction: boolean;
  };
  /** Security settings */
  security: {
    /** CORS configuration */
    cors: string | null;
  };
  /** Database configuration */
  database: {
    /** Database URL */
    url: string | null;
  };
  /** JWT configuration */
  jwt: {
    /** JWT secret */
    secret: string | null;
    /** JWT expiration time */
    expiresIn: JwtExpiresInType | null;
    /** JWT refresh settings */
    refresh: {
      /** Refresh token secret */
      secret: string | null;
      /** Refresh token expiration */
      expiresIn: JwtExpiresInType | null;
    };
  };
  /** AI service configuration */
  ai: {
    /** OpenAI settings */
    openai: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
    /** Mistral AI settings */
    mistral: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
    /** Groq settings */
    groq: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
    /** Anthropic settings */
    anthropic: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
    /** Google Gemini settings */
    gemini: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
    /** Llama settings */
    llama: {
      /** API key */
      key: string | null;
      /** Model name */
      model: string | null;
    };
  };
  /** Monitoring configuration */
  monitoring: {
    /** Sentry settings */
    sentry: {
      /** DSN URL */
      dsn: string | null;
      /** Auth token */
      token: string | null;
    };
  };
  /** Storage configuration */
  storage: {
    /** Cloudflare settings */
    cloudflare: {
      /** API keys */
      key: {
        /** Secret key */
        secret: string | null;
        /** Access key */
        access: string | null;
      };
      /** API endpoint */
      endpoint: string | null;
      /** Public URL */
      public: string | null;
    };
  };
  /** Email configuration */
  mailer: {
    /** Development mail settings */
    dev: {
      /** Development mail URL */
      url: string | null;
    };
    /** Brevo mail settings */
    brevo: {
      /** API key */
      key: string | null;
    };
  };
  /** Payment processing configuration */
  payment: {
    /** Stripe settings */
    stripe: {
      /** Secret key */
      secret: string | null;
    };
  };
};

/**
 * Configuration interface
 */
export interface IConfig {
  /**
   * Converts configuration to JSON format
   * @returns Configuration as JSON object
   */
  toJson: () => Record<string, ScalarType | null>;
}
