import { AppEnvType } from '../app/types.ts';
import { JwtExpiresInType } from '../jwt/types.ts';
import { ScalarType } from '../types.ts';

export type EnvConfigType = {
  app: {
    env: AppEnvType | null;
    url: string | null;
  };
  security: {
    cors: string | null;
  };
  database: {
    url: string | null;
  };
  jwt: {
    secret: string | null;
    expiresIn: JwtExpiresInType | null;
    refresh: {
      secret: string | null;
      expiresIn: JwtExpiresInType | null;
    };
  };
  ai: {
    openai: {
      key: string | null;
      model: string | null;
    };
    mistral: {
      key: string | null;
      model: string | null;
    };
    groq: {
      key: string | null;
      model: string | null;
    };
    anthropic: {
      key: string | null;
      model: string | null;
    };
    gemini: {
      key: string | null;
      model: string | null;
    };
    llama: {
      key: string | null;
      model: string | null;
    };
  };
  monitoring: {
    sentry: {
      dsn: string | null;
      token: string | null;
    };
  };
  storage: {
    cloudflare: {
      key: {
        secret: string | null;
        access: string | null;
      };
      endpoint: string | null;
      public: string | null;
    };
  };
  mailer: {
    brevo: {
      key: string | null;
    };
  };
  payment: {
    stripe: {
      secret: string | null;
    };
  };
};

export interface IConfig {
  toJson: () => Record<string, ScalarType | null>;
}
