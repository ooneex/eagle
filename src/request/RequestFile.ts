import { toKebabCase } from '@/helper/toKebabCase.ts';
import { Random } from '@/random/Random.ts';
import type { IStorage } from '@/storage/types.ts';
import type { IRequestFile } from './types.ts';

export class RequestFile implements IRequestFile {
  public readonly name: string;
  public readonly originalName: string;
  public readonly type: string;
  public readonly size: number;
  public readonly extension: string;
  public readonly isImage: boolean;
  public readonly isSvg: boolean;
  public readonly isVideo: boolean;
  public readonly isAudio: boolean;
  public readonly isPdf: boolean;
  public readonly isText: boolean;
  public readonly isExcel: boolean;
  public readonly isCsv: boolean;
  public readonly isJson: boolean;
  public readonly isXml: boolean;
  public readonly isHtml: boolean;

  constructor(private readonly native: File) {
    const match = this.native.name.match(/\.([0-9a-z]+)$/i);
    this.extension = (match ? match[1] : '').toLowerCase();
    this.originalName = toKebabCase(
      this.native.name.replace(/\.[0-9a-z]*$/i, ''),
    );
    this.originalName = `${this.originalName}.${this.extension}`;
    this.type = this.native.type;
    this.size = this.native.size;
    const id = Random.nanoid(15);
    this.name = `${id}.${this.extension}`;
    this.isImage = this.type.startsWith('image/');
    this.isSvg =
      this.type.startsWith('image/svg+xml') && this.extension === 'svg';
    this.isVideo = this.type.startsWith('video/');
    this.isAudio = this.type.startsWith('audio/');
    this.isPdf =
      this.type.startsWith('application/pdf') && this.extension === 'pdf';
    this.isText =
      this.type.startsWith('text/plain') && this.extension === 'txt';
    this.isExcel = this.type.startsWith(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    this.isCsv = this.type.startsWith('text/csv') && this.extension === 'csv';
    this.isJson =
      (this.type.startsWith('application/json') && this.extension === 'json') ||
      (this.type.startsWith('application/ld+json') &&
        this.extension === 'jsonld');
    this.isXml =
      this.type.startsWith('application/xml') && this.extension === 'xml';
    this.isHtml =
      this.type.startsWith('text/html') && this.extension === 'html';
  }

  public async readAsArrayBuffer(): Promise<ArrayBuffer> {
    return await this.native.arrayBuffer();
  }

  public readAsStream(): ReadableStream<Uint8Array> {
    return this.native.stream();
  }

  public async readAsText(): Promise<string> {
    return await this.native.text();
  }

  public async write(path: string): Promise<void> {
    await Bun.write(path, this.native);
  }

  public async store(storage: IStorage): Promise<string> {
    await storage.put(this.name, this.native);

    return this.name;
  }
}
