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

  it('should format originalName correctly', () => {
    const testCases = [
      {
        input: 'My File Name.txt',
        expected: 'my-file-name.txt',
      },
      {
        input: 'Test_Document.pdf',
        expected: 'test-document.pdf',
      },
      {
        input: 'Sample   File.jpg',
        expected: 'sample-file.jpg',
      },
      {
        input: 'UPPERCASE.png',
        expected: 'uppercase.png',
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const mockFile = new File(['test'], input, {
        type: 'application/octet-stream',
      });
      const requestFile = new RequestFile(mockFile);
      expect(requestFile.originalName).toBe(expected);
    });
  });

  it('should correctly identify image files', () => {
    const imageFile = new File(['image data'], 'photo.jpg', {
      type: 'image/jpeg',
    });
    const textFile = new File(['text content'], 'document.txt', {
      type: 'text/plain',
    });

    const imageRequestFile = new RequestFile(imageFile);
    const textRequestFile = new RequestFile(textFile);

    expect(imageRequestFile.isImage).toBe(true);
    expect(textRequestFile.isImage).toBe(false);
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
