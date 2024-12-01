import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import { DocContainer } from '../doc/mod.ts';
import { File } from '../file/mod.ts';
import { register } from './register.ts';

describe('register', () => {
  const testDir = `${Deno.makeTempDirSync()}/test-resources`;
  const cacheDir = `${Deno.makeTempDirSync()}`;

  beforeEach(async () => {
    const testFile = new File(`${testDir}/TestService.ts`);
    await testFile.write(`
      export class TestService {
        public async test(): Promise<void> {
          // Test method
        }
      }
    `);
  });

  afterEach(async () => {
    // Cleanup test directories
    try {
      await Deno.remove(testDir, { recursive: true });
      await Deno.remove(cacheDir, { recursive: true });
    } catch (_) {
      // Ignore errors if directories don't exist
    }
    // Clear DocContainer
    DocContainer.clear();
  });

  it('should register docs from specified resources', async () => {
    const resources = [`${testDir}/TestService.ts`];
    await register(resources, cacheDir);
    const docs = DocContainer.get('TestService');
    expect(docs).toBeDefined();
    expect(docs?.findClasses({ name: /^Test/ })).toHaveLength(1);
    expect(docs?.findClasses({ name: /^Test/ })[0].name).toBe('TestService');
  });

  it('should register docs from src directory when no resources provided', async () => {
    // Clear container before test
    DocContainer.clear();

    await register(undefined, cacheDir);
    // Verify docs were registered from src directory
    expect(DocContainer.count()).toBeGreaterThan(0);
  });

  it('should use cached docs when available and up to date', async () => {
    const resources = [`${testDir}/TestService.ts`];

    // First registration to create cache
    await register(resources, cacheDir);

    // Clear container
    DocContainer.clear();

    // Second registration should use cache
    await register(resources, cacheDir);

    const docs = DocContainer.get('TestService');
    expect(docs).toBeDefined();
    expect(docs?.findClasses({ name: 'TestService' })).toHaveLength(1);
  });

  it('should create cache directory if it does not exist', async () => {
    const newCacheDir = `${Deno.makeTempDirSync()}/new-cache`;
    const resources = [`${testDir}/TestService.ts`];

    await register(resources, newCacheDir);

    // Verify cache directory and files were created
    const cacheExists = await Deno.stat(newCacheDir).then(() => true).catch(
      () => false,
    );
    expect(cacheExists).toBe(true);

    // Cleanup
    await Deno.remove(newCacheDir, { recursive: true });
  });

  it('should register docs from specified resources', async () => {
    const resources = [`${testDir}/TestService.ts`];
    await register(resources, cacheDir);
    const docs = DocContainer.get('TestService');
    expect(docs).toBeDefined();
  });

  it('should update cache when source file is modified', async () => {
    const testFile = `${testDir}/ModifiedService.ts`;

    // Create initial service file
    Deno.writeTextFileSync(
      testFile,
      `
      export class ModifiedService {
        public getName(): string {
          return 'original';
        }
      }
    `,
    );

    await register([testFile], cacheDir);
    let docs = DocContainer.get('ModifiedService');
    expect(docs?.findMethods({ name: 'getName' })).toHaveLength(1);

    // Modify the service file
    Deno.writeTextFileSync(
      testFile,
      `
      export class ModifiedService {
        public getName(): string {
          return 'modified';
        }
        public getVersion(): number {
          return 2;
        }
      }
    `,
    );

    // Re-register should update cache
    await register([testFile], cacheDir);
    docs = DocContainer.get('ModifiedService');
    expect(docs?.findMethods({ name: 'getVersion' })).toHaveLength(1);

    // Cleanup
    Deno.removeSync(testFile);
  });

  it('should handle multiple classes in single file', async () => {
    const testFile = `${testDir}/MultipleClasses.ts`;

    Deno.writeTextFileSync(
      testFile,
      `
      export class FirstService {
        public method1() {}
      }
      export class SecondService {
        public method2() {}
      }
    `,
    );

    await register([testFile], cacheDir);

    expect(DocContainer.get('FirstService')).toBeDefined();
    expect(DocContainer.get('SecondService')).toBeDefined();

    // Cleanup
    Deno.removeSync(testFile);
  });
});
