import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { IRequestFile } from './types.ts';

/**
 * A wrapper class for handling file operations in requests.
 * Implements the IRequestFile interface and provides functionality for file management.
 */
export class RequestFile implements IRequestFile {
  /** Generated unique filename */
  public readonly name: string;
  /** Original filename in kebab-case format */
  public readonly originalName: string;
  /** MIME type of the file */
  public readonly type: string;
  /** Size of the file in bytes */
  public readonly size: number;
  /** File extension */
  public readonly extension: string;
  /** Whether the file is an image based on MIME type */
  public readonly isImage: boolean;

  /**
   * Creates a new RequestFile instance
   * @param native The native File object to wrap
   */
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

  /**
   * Gets the file data as an ArrayBuffer
   * @returns Promise resolving to an ArrayBuffer containing the file data
   */
  public async getData(): Promise<ArrayBuffer> {
    return await this.native.arrayBuffer();
  }

  /**
   * Gets a ReadableStream of the file data
   * @returns ReadableStream containing file data as Uint8Array chunks
   */
  public getStream(): ReadableStream<Uint8Array> {
    return this.native.stream();
  }

  /**
   * Writes the file to disk at the specified path
   * @param path File system path where the file should be written
   * @param options Optional Deno write file options
   */
  public async write(
    path: string,
    options?: Deno.WriteFileOptions,
  ): Promise<void> {
    const data = this.getStream();
    await Deno.writeFile(path, data, options);
  }
}
