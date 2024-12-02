/**
 * File handling module providing utilities for file operations and management.
 *
 * @module file
 *
 * @example
 * ```ts
 * import { File } from 'eagle';
 *
 * // Reading a file
 * const file = new File('config.json');
 * const content = await file.read();
 * const config = JSON.parse(content);
 * ```
 *
 * @example
 * ```ts
 * // Writing to a file
 * const file = new File('data.txt');
 * await file.write('Hello World');
 *
 * // Append content
 * await file.append('\nNew line');
 * ```
 *
 * @example
 * ```ts
 * // File operations with streams
 * const sourceFile = new File('source.txt');
 * const destFile = new File('destination.txt');
 *
 * const readStream = await sourceFile.createReadStream();
 * const writeStream = await destFile.createWriteStream();
 *
 * await readStream.pipeTo(writeStream);
 * ```
 *
 * @example
 * ```ts
 * // Working with file metadata
 * const file = new File('document.pdf');
 *
 * const exists = await file.exists();
 * if (exists) {
 *   const stats = await file.stat();
 *   console.log(`Size: ${stats.size} bytes`);
 *   console.log(`Last modified: ${stats.mtime}`);
 * }
 * ```
 */

export { File } from './File.ts';
export * from './types.ts';
