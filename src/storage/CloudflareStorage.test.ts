import { EnvConfig } from '@/config/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { S3Client } from 'npm:@aws-sdk/client-s3@3.703.0';
import { CloudflareStorage, StorageException } from './mod.ts';

describe('CloudflareStorage', () => {
  let storage: CloudflareStorage;

  beforeEach(() => {
    // Setup environment variables
    Deno.env.set(EnvConfig.KEYS.storage.cloudflare.key.secret, 'test-secret');
    Deno.env.set(EnvConfig.KEYS.storage.cloudflare.key.access, 'test-access');
    Deno.env.set(
      EnvConfig.KEYS.storage.cloudflare.endpoint,
      'https://test-endpoint.com',
    );

    storage = new CloudflareStorage();
  });

  afterEach(() => {
    // Clean up environment variables
    Deno.env.delete(EnvConfig.KEYS.storage.cloudflare.key.secret);
    Deno.env.delete(EnvConfig.KEYS.storage.cloudflare.key.access);
    Deno.env.delete(EnvConfig.KEYS.storage.cloudflare.endpoint);
  });

  describe('region management', () => {
    it('should have default region set to eeur', () => {
      expect(storage.getRegion()).toBe('eeur');
    });

    it('should allow setting a new region', () => {
      storage.setRegion('weur');
      expect(storage.getRegion()).toBe('weur');
    });
  });

  describe('storage operations', () => {
    it('should throw StorageException when credentials are not set', async () => {
      // Remove environment variables
      Deno.env.delete(EnvConfig.KEYS.storage.cloudflare.key.secret);

      try {
        await storage.get('test-key', 'test-bucket');
      } catch (e) {
        expect(e).toBeInstanceOf(StorageException);
      }
    });

    it('should successfully check if bucket exists', async () => {
      const mockClient = new S3Client({});
      stub(mockClient, 'send', () => Promise.resolve({}));

      // @ts-ignore - Replacing private property for testing
      storage['getClient'] = () => mockClient;

      const result = await storage.hasBucket('test-bucket');
      expect(result).toBe(true);
    });

    it('should return false when bucket does not exist', async () => {
      const mockClient = new S3Client({});
      stub(
        mockClient,
        'send',
        () => Promise.reject(new Error('Bucket not found')),
      );

      // @ts-ignore - Replacing private property for testing
      storage['getClient'] = () => mockClient;

      const result = await storage.hasBucket('non-existent-bucket');
      expect(result).toBe(false);
    });
  });
});
