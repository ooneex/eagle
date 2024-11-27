import { RequestFile } from '@/request/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('RequestFile', () => {
  it('should create a RequestFile with correct properties', () => {
    const mockFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    const requestFile = new RequestFile(mockFile);

    expect(requestFile.originalName).toBe('test.txt');
    expect(requestFile.type).toBe('text/plain');
    expect(requestFile.size).toBe(12);
    expect(requestFile.name).toMatch(/^[0-9a-f-]+\.txt$/);
  });

  it('should get file data as ArrayBuffer', async () => {
    const content = 'test content';
    const mockFile = new File([content], 'test.txt', {
      type: 'text/plain',
    });

    const requestFile = new RequestFile(mockFile);
    const data = await requestFile.getData();

    expect(data).toBeInstanceOf(ArrayBuffer);
    const text = new TextDecoder().decode(data);
    expect(text).toBe(content);
  });

  it('should get file data as ReadableStream', () => {
    const content = 'test content';
    const mockFile = new File([content], 'test.txt', {
      type: 'text/plain',
    });

    const requestFile = new RequestFile(mockFile);
    const stream = requestFile.getStream();

    expect(stream).toBeInstanceOf(ReadableStream);
  });
});
