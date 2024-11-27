import {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from 'npm:@aws-sdk/client-s3';
import { EnvConfig } from '../config/EnvConfig.ts';
import { MimeType } from '../http/types.ts';
import { service } from '../service/decorators.ts';
import { StorageException } from './StorageException.ts';
import { CloudflareRegionType } from './types.ts';

@service()
export class CloudflareStorageAdapterService {
  private client: S3Client;
  private region: CloudflareRegionType = 'eeur';

  constructor() {
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

    this.client = new S3Client({
      endpoint,
      region: this.region,
      credentials: {
        accessKeyId: access,
        secretAccessKey: secret,
      },
    });
  }

  public async get(path: string, bucket: string) {
    return await this.client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: path,
      }),
    );
  }

  public async hasBucket(bucket: string) {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
      return true;
    } catch (_e) {
      return false;
    }
  }

  public async put(
    name: string,
    content: string,
    options?:
      & Omit<
        PutObjectCommandInput,
        'Key' | 'Body' | 'ContentType'
      >
      & {
        contentType?: MimeType;
        Bucket?: string;
      },
  ) {
    return await this.client.send(
      new PutObjectCommand({
        Bucket: options?.Bucket,
        Key: name,
        Body: content,
        ...options,
      }),
    );
  }

  public setRegion(region: CloudflareRegionType) {
    this.region = region;
  }

  public getRegion() {
    return this.region;
  }
}
