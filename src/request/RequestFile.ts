import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { IRequestFile } from './types.ts';

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
    const id = crypto.randomUUID();
    this.name = `${id}.${this.extension}`;
    this.isImage = this.type.startsWith('image/');
  }

  public async getData(): Promise<ArrayBuffer> {
    return await this.native.arrayBuffer();
  }

  public getStream(): ReadableStream<Uint8Array> {
    return this.native.stream();
  }

  public async write(
    path: string,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    const data = this.getStream();
    await Deno.writeFile(path, data, options);
  }
}
