import { EnvConfig } from '@/config/mod.ts';
import {
  CloudflareStorageAdapterService,
  StorageException,
} from '@/storage/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('CloudflareAdapterService', () => {
  const mockEnv = {
    [EnvConfig.KEYS.storage.cloudflare.key.secret]: 'test-secret',
    [EnvConfig.KEYS.storage.cloudflare.key.access]: 'test-access',
    [EnvConfig.KEYS.storage.cloudflare.endpoint]: 'https://test-endpoint.com',
  };

  beforeEach(() => {
    // Set up environment variables before each test
    for (const [key, value] of Object.entries(mockEnv)) {
      Deno.env.set(key, value);
    }
  });

  afterEach(() => {
    // Clean up environment variables after each test
    for (const key of Object.keys(mockEnv)) {
      Deno.env.delete(key);
    }
  });

  it('should initialize with correct configuration', () => {
    const mockS3Client = {
      config: {
        region: 'eu-central-1',
      },
    };

    const service = new CloudflareStorageAdapterService();
    // @ts-ignore - Mock S3 client
    service.client = mockS3Client;

    expect(service.getRegion()).toBe('eu-central-1');
  });

  it('should throw StorageException when credentials are missing', () => {
    Deno.env.delete(EnvConfig.KEYS.storage.cloudflare.key.secret);

    expect(() => {
      new CloudflareStorageAdapterService();
    }).toThrow(StorageException);
  });

  it('should set and get region', () => {
    const service = new CloudflareStorageAdapterService();
    service.setRegion('us-east-1');
    expect(service.getRegion()).toBe('us-east-1');
  });
});
