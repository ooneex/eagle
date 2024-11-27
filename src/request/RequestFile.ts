import { IRequestFile } from './types.ts';

export class RequestFile implements IRequestFile {
  public readonly name: string;
  public readonly originalName: string;
  public readonly type: string;
  public readonly size: number;

  constructor(private readonly native: File) {
    this.originalName = this.native.name;
    this.type = this.native.type;
    this.size = this.native.size;
    const id = crypto.randomUUID();
    const extension = this.originalName.split('.').pop() || '';
    this.name = `${id}.${extension}`;
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
