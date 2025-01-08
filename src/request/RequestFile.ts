import { toKebabCase } from '@/helper/toKebabCase.ts';
import { Random } from '@/random/Random.ts';
import type { IRequestFile } from './types.ts';

export class RequestFile implements IRequestFile {
  public readonly name: string;
  public readonly originalName: string;
  public readonly type: string;
  public readonly size: number;
  public readonly extension: string;
  public readonly isImage: boolean;

  constructor(private readonly native: File) {
    this.extension = this.native.name.split('.').pop() || '';
    this.originalName = toKebabCase(
      this.native.name.replace(`.${this.extension}`, ''),
    );
    this.originalName = `${this.originalName}.${this.extension}`;
    this.type = this.native.type;
    this.size = this.native.size;
    const id = Random.nanoid(15);
    this.name = `${id}.${this.extension}`;
    this.isImage = this.type.startsWith('image/');
  }

  public async getData(): Promise<ArrayBuffer> {
    return await this.native.arrayBuffer();
  }

  public getStream(): ReadableStream<Uint8Array> {
    return this.native.stream();
  }

  public async write(path: string): Promise<void> {
    await Bun.write(path, this.native);
  }
}
