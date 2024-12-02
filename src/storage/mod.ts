/**
 * Storage module for handling file storage operations with different providers.
 *
 * @module storage
 *
 * @example
 * ```ts
 * // Basic file upload
 * const storage = new CloudflareStorage();
 *
 * const file = request.files.get('document');
 * const path = await storage.upload('uploads/documents', file);
 * console.log('File uploaded to:', path);
 * ```
 *
 * @example
 * ```ts
 * // Using storage in controllers
 * @controller()
 * class FileController {
 *   constructor(private storage: CloudflareStorage) {}
 *
 *   @post('/upload')
 *   async uploadFile(request: HttpRequest) {
 *     const file = request.files.get('file');
 *     const path = await this.storage.upload('uploads', file);
 *     return new HttpResponse().json({ path });
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // File operations
 * const storage = new CloudflareStorage();
 *
 * // Upload file
 * const uploadPath = await storage.upload('images', imageFile);
 *
 * // Check if file exists
 * const exists = await storage.exists(uploadPath);
 *
 * // Get file URL
 * const url = await storage.url(uploadPath);
 *
 * // Delete file
 * await storage.delete(uploadPath);
 * ```
 *
 * @example
 * ```ts
 * // Working with directories
 * const storage = new CloudflareStorage();
 *
 * // List directory contents
 * const files = await storage.list('uploads');
 *
 * // Create directory
 * await storage.makeDirectory('uploads/images');
 *
 * // Delete directory and contents
 * await storage.deleteDirectory('uploads/temp');
 * ```
 */

export { CloudflareStorage } from './CloudflareStorage.ts';
export * from './decorators.ts';
export { StorageDecoratorException } from './StorageDecoratorException.ts';
export { StorageException } from './StorageException.ts';
export * from './types.ts';
