import { PutObjectCommandInput } from 'npm:@aws-sdk/client-s3';
import { MimeType } from '../http/types.ts';

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

export type CloudflareRegionType =
  | 'wnam'
  | 'enam'
  | 'weur'
  | 'eeur'
  | 'apac'
  | 'oc';

export type CloudflareStoragePutOptionsType =
  & Omit<
    PutObjectCommandInput,
    'Key' | 'Body' | 'ContentType'
  >
  & {
    contentType?: MimeType;
    Bucket?: string;
  };

export interface IStorage {
  get: <T>(key: string, bucket: string) => Promise<T>;
  put: <T>(
    key: string,
    content: string,
    options?: any,
  ) => Promise<T>;
  delete: <T>(key: string, bucket: string) => Promise<T>;
}
