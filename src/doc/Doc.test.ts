import { Doc } from '@/doc/mod.ts';
import { expect } from '@std/expect';
import { afterAll, describe, it } from '@std/testing/bdd';

describe('Doc', () => {
  const tmpFile = Deno.makeTempFileSync({
    suffix: '.ts',
  });
  Deno.writeTextFileSync(
    tmpFile,
    `export class TestClass {
        private name: string = 'Test';
        private age: number = 30;
        private isActive: boolean = true;

        constructor(name: string) {
          this.name = name;
        }

        public getName(): string {
          return this.name;
        }

        public setName(name: string): void {
          this.name = name;
        }

        public getAge(): number {
          return this.age;
        }

        public setAge(age: number): void {
          this.age = age;
        }

        public isActiveUser(): boolean {
          return this.isActive;
        }

        public setActiveStatus(status: boolean): void {
          this.isActive = status;
        }

        public async fetchUserData(): Promise<{name: string; age: number}> {
          // Simulating async data fetch
          return {
            name: this.name,
            age: this.age
          };
        }
    }`,
  );

  const doc = new Doc(tmpFile);

  // Clean up temp file after tests

  afterAll(() => {
    Deno.removeSync(tmpFile);
  });

  it('should parse class properties correctly', async () => {
    const properties = await doc.findProperties({});

    expect(properties.length).toBe(3);
    expect(properties.map((p) => p.name)).toContain('name');
    expect(properties.map((p) => p.name)).toContain('age');
    expect(properties.map((p) => p.name)).toContain('isActive');
  });

  it('should find properties by name', async () => {
    const nameProps = await doc.findProperties({ name: 'name' });
    expect(nameProps.length).toBe(1);
    expect(nameProps[0].type).toBe('string');
    expect(nameProps[0].accessibility).toBe('private');
  });

  it('should find properties by type', async () => {
    const numberProps = await doc.findProperties({ type: 'number' });
    expect(numberProps.length).toBe(1);
    expect(numberProps[0].name).toBe('age');
  });

  it('should parse class methods correctly', async () => {
    const methods = await doc.findMethods({});

    expect(methods.length).toBe(7);
    expect(methods.map((m) => m.name)).toContain('getName');
    expect(methods.map((m) => m.name)).toContain('setName');
    expect(methods.map((m) => m.name)).toContain('fetchUserData');
  });

  it('should find methods by name', async () => {
    const getMethods = await doc.findMethods({ name: /^get/ });
    expect(getMethods.length).toBe(2);
    expect(getMethods.map((m) => m.name)).toContain('getName');
    expect(getMethods.map((m) => m.name)).toContain('getAge');
  });

  it('should find methods by return type', async () => {
    const stringMethods = await doc.findMethods({ returnType: 'string' });
    expect(stringMethods.length).toBe(1);
    expect(stringMethods[0].name).toBe('getName');
  });

  it('should find async methods', async () => {
    const asyncMethods = await doc.findMethods({ isAsync: true });
    expect(asyncMethods.length).toBe(1);
    expect(asyncMethods[0].name).toBe('fetchUserData');
  });
});