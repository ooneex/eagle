import type { BunFile, S3File, S3Options } from 'bun';

export type { BunFile, S3File, S3Options };

export interface IStorage {
  getOptions(): S3Options;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  putFile(key: string, localPath: string): Promise<number>;
  put(
    key: string,
    content:
      | string
      | ArrayBufferView
      | ArrayBuffer
      | SharedArrayBuffer
      | Request
      | Response
      | BunFile
      | S3File
      | Blob,
  ): Promise<number>;
  getAsJson(key: string): Promise<any>;
  getAsArrayBuffer(key: string): Promise<ArrayBuffer>;
  getAsStream(key: string): ReadableStream;
}
