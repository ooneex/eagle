import { Doc } from '@/doc/mod.ts';
import { expect } from '@std/expect';
import { afterAll, beforeAll, describe, it } from '@std/testing/bdd';

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
        private roles: string[] = ['ROLE_USER', 'ROLE_ADMIN'];

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

  beforeAll(async () => {
    await doc.parse();
  });

  afterAll(() => {
    Deno.removeSync(tmpFile);
  });

  it('should parse class properties correctly', () => {
    const properties = doc.findProperties({});

    expect(properties.length).toBe(4);
    expect(properties.map((p) => p.name)).toContain('name');
    expect(properties.map((p) => p.name)).toContain('age');
    expect(properties.map((p) => p.name)).toContain('isActive');
  });

  it('should find properties by name', () => {
    const nameProps = doc.findProperties({ name: 'name' });
    expect(nameProps.length).toBe(1);
    expect(nameProps[0].types).toContain('string');
    expect(nameProps[0].accessibility).toBe('private');
  });

  it('should find properties by type', () => {
    const numberProps = doc.findProperties({ types: ['number'] });
    expect(numberProps.length).toBe(1);
    expect(numberProps[0].name).toBe('age');
  });

  it('should correctly identify property types', () => {
    const properties = doc.findProperties({});

    // Create a map of property names to their expected types
    const expectedTypes: Record<string, string[]> = {
      'name': ['string'],
      'age': ['number'],
      'isActive': ['boolean'],
      'roles': ['string[]'],
    };

    properties.map((prop) => {
      const expected = expectedTypes[prop.name];
      expect(expected).toBeDefined();

      // Check if at least one of the expected types matches
      const hasMatchingType = prop.types.some((type) =>
        expected.includes(type)
      );
      expect(hasMatchingType).toBe(true);
    });

    // Additional specific checks
    const rolesProperty = properties.find((p) => p.name === 'roles');
    expect(rolesProperty).toBeDefined();
    expect(rolesProperty?.types).toContain('string[]');
  });

  it('should correctly identify array properties', () => {
    const arrayProps = doc.findProperties({ types: ['string[]'] });

    expect(arrayProps.length).toBe(1);
    expect(arrayProps[0].name).toBe('roles');
    expect(arrayProps[0].types).toContain('string[]');
  });

  it('should parse class methods correctly', () => {
    const methods = doc.findMethods({});

    expect(methods.length).toBe(7);
    expect(methods.map((m) => m.name)).toContain('getName');
    expect(methods.map((m) => m.name)).toContain('setName');
    expect(methods.map((m) => m.name)).toContain('fetchUserData');
  });

  it('should find methods by name', () => {
    const getMethods = doc.findMethods({ name: /^get/ });
    expect(getMethods.length).toBe(2);
    expect(getMethods.map((m) => m.name)).toContain('getName');
    expect(getMethods.map((m) => m.name)).toContain('getAge');
  });

  it('should find methods by return type', () => {
    const stringMethods = doc.findMethods({ returnType: 'string' });
    expect(stringMethods.length).toBe(1);
    expect(stringMethods[0].name).toBe('getName');
  });

  it('should find async methods', () => {
    const asyncMethods = doc.findMethods({ isAsync: true });
    expect(asyncMethods.length).toBe(1);
    expect(asyncMethods[0].name).toBe('fetchUserData');
  });

  it('should find parameters for a method', () => {
    const params = doc.findParameters('TestClass', 'setName');
    expect(params.length).toBe(1);
    expect(params[0].name).toBe('name');
    expect(params[0].types).toContain('string');
    expect(params[0].isOptional).toBe(false);
  });

  it('should return empty array for non-existent method', () => {
    const params = doc.findParameters('User', 'nonExistentMethod');
    expect(params).toEqual([]);
  });

  it('should return empty array for non-existent class', () => {
    const params = doc.findParameters('NonExistentClass', 'someMethod');
    expect(params).toEqual([]);
  });
});
