import { type BunFile, S3Client, type S3File, type S3Options } from 'bun';
import type { IStorage } from './types.ts';

export abstract class AbstractStorage implements IStorage {
  public abstract getOptions(): S3Options;

  public async exists(key: string): Promise<boolean> {
    const client = this.getClient();

    return await client.exists(key);
  }

  public async delete(key: string): Promise<void> {
    const client = this.getClient();

    await client.delete(key);
  }

  public async putFile(key: string, localPath: string): Promise<number> {
    const file = Bun.file(localPath);

    return await this.put(key, file);
  }

  public async put(
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
  ): Promise<number> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.write(content);
  }

  public async getAsJson(key: string): Promise<any> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.json();
  }

  public async getAsArrayBuffer(key: string): Promise<ArrayBuffer> {
    const s3file: S3File = this.getS3File(key);

    return await s3file.arrayBuffer();
  }

  public getAsStream(key: string): ReadableStream {
    const s3file: S3File = this.getS3File(key);

    return s3file.stream();
  }

  private getClient(): S3Client {
    return new S3Client(this.getOptions());
  }

  private getS3File(path: string): S3File {
    const client = this.getClient();

    return client.file(path);
  }
}
