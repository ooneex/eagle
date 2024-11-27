import { File } from '@/file/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';

describe('File', () => {
  let testDir = '';

  // Helper to create test directory and files
  const setupTestFiles = () => {
    try {
      testDir = Deno.makeTempDirSync();
      Deno.writeTextFileSync(`${testDir}/file1.txt`, 'content');
      Deno.writeTextFileSync(`${testDir}/file2.json`, '{}');
      Deno.mkdirSync(`${testDir}/subdir`);
      Deno.writeTextFileSync(`${testDir}/subdir/file3.txt`, 'content');
    } catch {
      // Directory might already exist
    }
  };

  // Helper to cleanup test files
  const cleanupTestFiles = () => {
    try {
      Deno.removeSync(testDir, { recursive: true });
    } catch {
      // Directory might not exist
    }
  };

  beforeEach(() => {
    cleanupTestFiles();
    setupTestFiles();
  });

  afterEach(() => {
    cleanupTestFiles();
  });

  it('should list files in a directory', () => {
    const file = new File(testDir);
    const files = file.list();

    expect(files.length).toBe(2);
    expect(files).toContain(`${testDir}/file1.txt`);
    expect(files).toContain(`${testDir}/file2.json`);
  });

  it('should list files recursively', () => {
    const file = new File(testDir);
    const files = file.list({ recursive: true });

    expect(files.length).toBe(3);
    expect(files).toContain(`${testDir}/file1.txt`);
    expect(files).toContain(`${testDir}/file2.json`);
    expect(files).toContain(`${testDir}/subdir/file3.txt`);
  });

  it('should filter files using match pattern', () => {
    const file = new File(testDir);
    const files = file.list({ match: /\.txt$/ });

    expect(files.length).toBe(1);
    expect(files[0]).toBe(`${testDir}/file1.txt`);
  });

  it('should exclude files using exclude pattern', () => {
    const file = new File(testDir);
    const files = file.list({ exclude: /\.json$/ });

    expect(files.length).toBe(1);
    expect(files[0]).toBe(`${testDir}/file1.txt`);
  });

  it('should handle non-existent directories', () => {
    const file = new File('./non-existent');
    const files = file.list();

    expect(files.length).toBe(0);
  });

  it('should combine recursive, match, and exclude options', () => {
    const file = new File(testDir);
    const files = file.list({
      recursive: true,
      match: /\.txt$/,
      exclude: /subdir/,
    });

    expect(files.length).toBe(2);
    expect(files[0]).toBe(`${testDir}/file1.txt`);
  });

  it('should check if a file exists', async () => {
    const file = new File(testDir);
    const exists = await file.exists();

    expect(exists).toBe(true);
  });

  it('should check if a file does not exist', async () => {
    const file = new File(`${testDir}/non-existent.txt`);
    const exists = await file.exists();

    expect(exists).toBe(false);
  });
});
