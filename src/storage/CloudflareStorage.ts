import {
  DeleteObjectCommand,
  DeleteObjectOutput,
  GetObjectCommand,
  GetObjectOutput,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectOutput,
  S3Client,
} from 'npm:@aws-sdk/client-s3';
import { EnvConfig } from '../config/EnvConfig.ts';
import { storage } from './decorators.ts';
import { StorageException } from './StorageException.ts';
import {
  CloudflareRegionType,
  CloudflareStoragePutOptionsType,
  IStorage,
} from './types.ts';

@storage()
export class CloudflareStorage implements IStorage {
  private region: CloudflareRegionType = 'eeur';

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

  public async hasBucket(bucket: string) {
    try {
      const client = this.getClient();

      await client.send(new HeadBucketCommand({ Bucket: bucket }));
      return true;
    } catch (_e) {
      return false;
    }
  }

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

  public setRegion(region: CloudflareRegionType) {
    this.region = region;
  }

  public getRegion() {
    return this.region;
  }

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
