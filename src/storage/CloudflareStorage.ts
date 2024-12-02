import {
  DeleteObjectCommand,
  DeleteObjectOutput,
  GetObjectCommand,
  GetObjectOutput,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectOutput,
  S3Client,
} from 'npm:@aws-sdk/client-s3@3.703.0';
import { EnvConfig } from '../config/EnvConfig.ts';
import { storage } from './decorators.ts';
import { StorageException } from './StorageException.ts';
import {
  CloudflareRegionType,
  CloudflareStoragePutOptionsType,
  IStorage,
} from './types.ts';

/**
 * CloudflareStorage implements storage operations for Cloudflare R2 using S3-compatible API
 */
@storage()
export class CloudflareStorage implements IStorage {
  /** Current Cloudflare region */
  private region: CloudflareRegionType = 'eeur';

  /**
   * Retrieves an object from storage
   * @param key Object key
   * @param bucket Bucket name
   * @returns Retrieved object cast to type T
   */
  public async get<T = GetObjectOutput>(
    key: string,
    bucket: string,
  ): Promise<T> {
    const client = this.getClient();

    return (await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )) as T;
  }

  /**
   * Checks if a bucket exists
   * @param bucket Bucket name to check
   * @returns True if bucket exists, false otherwise
   */
  public async hasBucket(bucket: string) {
    try {
      const client = this.getClient();

      await client.send(new HeadBucketCommand({ Bucket: bucket }));
      return true;
    } catch (_e) {
      return false;
    }
  }

  /**
   * Puts an object into storage
   * @param key Object key
   * @param content Content to store
   * @param options Additional storage options
   * @returns Put operation result cast to type T
   */
  public async put<T = PutObjectOutput>(
    key: string,
    content: string,
    options?: CloudflareStoragePutOptionsType,
  ): Promise<T> {
    const client = this.getClient();
    return (await client.send(
      new PutObjectCommand({
        Bucket: options?.Bucket,
        Key: key,
        Body: content,
        ...options,
      }),
    )) as T;
  }

  /**
   * Deletes an object from storage
   * @param key Object key
   * @param bucket Bucket name
   * @returns Delete operation result cast to type T
   */
  public async delete<T = DeleteObjectOutput>(
    key: string,
    bucket: string,
  ): Promise<T> {
    const client = this.getClient();
    return (await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    )) as T;
  }

  /**
   * Sets the Cloudflare region
   * @param region Region to set
   */
  public setRegion(region: CloudflareRegionType) {
    this.region = region;
  }

  /**
   * Gets the current Cloudflare region
   * @returns Current region
   */
  public getRegion() {
    return this.region;
  }

  /**
   * Creates and returns configured S3 client
   * @returns Configured S3Client instance
   * @throws StorageException if credentials are not set
   */
  private getClient() {
    const secret = Deno.env.get(
      EnvConfig.KEYS.storage.cloudflare.key.secret,
    );
    const access = Deno.env.get(
      EnvConfig.KEYS.storage.cloudflare.key.access,
    );
    const endpoint = Deno.env.get(
      EnvConfig.KEYS.storage.cloudflare.endpoint,
    );

    if (!secret || !access || !endpoint) {
      throw new StorageException('Storage credentials are not set');
    }

    return new S3Client({
      endpoint,
      region: this.region,
      credentials: {
        accessKeyId: access,
        secretAccessKey: secret,
      },
    });
  }
}
