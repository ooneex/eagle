import { PutObjectCommandInput } from 'npm:@aws-sdk/client-s3@3.703.0';
import { MimeType } from '../http/types.ts';

/**
 * Type definition for AWS regions supported by the storage service.
 * Includes regions across Asia Pacific, Europe, North America, South America, and Canada.
 */
export type AWSRegionType =
  | 'ap-northeast-1'
  | 'ap-northeast-2'
  | 'ap-southeast-1'
  | 'ap-southeast-2'
  | 'ap-south-1'
  | 'eu-central-1'
  | 'eu-north-1'
  | 'eu-west-1'
  | 'eu-west-2'
  | 'eu-west-3'
  | 'us-east-1'
  | 'us-east-2'
  | 'us-west-1'
  | 'us-west-2'
  | 'sa-east-1'
  | 'ca-central-1';

/**
 * Type definition for Cloudflare regions supported by the storage service.
 * Includes regions across North America, Europe, Asia Pacific, and Oceania.
 */
export type CloudflareRegionType =
  | 'wnam'
  | 'enam'
  | 'weur'
  | 'eeur'
  | 'apac'
  | 'oc';

/**
 * Type definition for Cloudflare storage put operation options.
 * Extends AWS S3 PutObjectCommandInput, omitting Key, Body and ContentType fields.
 * Adds optional contentType and Bucket fields.
 */
export type CloudflareStoragePutOptionsType =
  & Omit<
    PutObjectCommandInput,
    'Key' | 'Body' | 'ContentType'
  >
  & {
    contentType?: MimeType;
    Bucket?: string;
  };

/**
 * Interface defining the core storage operations.
 * @interface
 * Provides methods for:
 * - get: Retrieve an item from storage
 * - put: Store an item in storage
 * - delete: Remove an item from storage
 */
export interface IStorage {
  get: <T>(key: string, bucket: string) => Promise<T>;
  hasBucket: (bucket: string) => Promise<boolean>;
  put: <T>(
    key: string,
    content: string,
    options?: any,
  ) => Promise<T>;
  delete: <T>(key: string, bucket: string) => Promise<T>;
  setRegion: (region: CloudflareRegionType) => void;
  getRegion: () => CloudflareRegionType;
  setEndpoint: (endpoint: string) => void;
  getEndpoint: () => string | null;
}
