import { ClassDocType } from '@/doc/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { stub } from '@std/testing/mock';
import { Doc } from './Doc.ts';

describe('Doc', () => {
  describe('constructor', () => {
    it('should initialize with empty docs array', () => {
      const doc = new Doc();
      expect(doc['docs']).toEqual([]);
    });
  });

  describe('setDocs', () => {
    it('should set docs array', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: false,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        properties: [],
        methods: [],
      }];
      doc.setDocs(testDocs);
      expect(doc['docs']).toEqual(testDocs);
    });
  });

  describe('parse', () => {
    it('should return empty array if no filePath', async () => {
      const doc = new Doc();
      const result = await doc.parse();
      expect(result).toEqual([]);
    });

    it('should parse file and return class documentation', async () => {
      // Mock Deno.Command
      const mockOutput = {
        stdout: new TextEncoder().encode(JSON.stringify({
          nodes: [{
            kind: 'class',
            name: 'TestClass',
            declarationKind: 'export',
            classDef: {
              isAbstract: false,
              methods: [],
              properties: [],
            },
          }],
        })),
      };

      const mockCommand = stub(
        Deno,
        'Command',
        () => ({
          output: () => Promise.resolve(mockOutput),
        }),
      );

      try {
        const doc = new Doc('test.ts');
        const result = await doc.parse();

        expect(result[0].name).toEqual('TestClass');
        expect(result[0].isExported).toEqual(true);
      } finally {
        mockCommand.restore();
      }
    });
  });

  describe('findClasses', () => {
    it('should find classes matching criteria', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: true,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        properties: [],
        methods: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findClasses({ isExported: true });
      expect(result).toEqual(testDocs);
    });

    it('should find classes by regex name', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: true,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        properties: [],
        methods: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findClasses({ name: /Test/ });
      expect(result).toEqual(testDocs);
    });
  });

  describe('findConstructors', () => {
    it('should find constructors matching criteria', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: false,
        isDefault: false,
        isAbstract: false,
        constructor: {
          name: 'constructor',
          accessibility: 'public',
          parameters: [],
        },
        methods: [],
        properties: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findConstructors({ accessibility: 'public' });
      expect(result[0].name).toEqual('constructor');
    });
  });

  describe('findProperties', () => {
    it('should find properties matching criteria', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: false,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        properties: [{
          name: 'testProp',
          types: ['string'],
          isOptional: false,
          isReadonly: true,
          accessibility: 'private',
          isAbstract: false,
          isStatic: false,
        }],
        methods: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findProperties({ isReadonly: true });
      expect(result[0].name).toEqual('testProp');
    });
  });

  describe('findMethods', () => {
    it('should find methods matching criteria', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: false,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        methods: [{
          name: 'testMethod',
          isAbstract: false,
          isStatic: false,
          isOptional: false,
          isAsync: true,
          isGenerator: false,
          accessibility: 'public',
          returnType: null,
          parameters: [],
        }],
        properties: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findMethods({ isAsync: true });
      expect(result[0].name).toEqual('testMethod');
    });
  });

  describe('findParameters', () => {
    it('should find parameters for specified class and method', () => {
      const doc = new Doc();
      const testDocs: ClassDocType[] = [{
        name: 'TestClass',
        isExported: false,
        isDefault: false,
        isAbstract: false,
        constructor: null,
        methods: [{
          name: 'testMethod',
          isAbstract: false,
          isStatic: false,
          isOptional: false,
          isAsync: false,
          isGenerator: false,
          accessibility: 'public',
          returnType: null,
          parameters: [{
            name: 'testParam',
            types: ['string'],
            isOptional: false,
          }],
        }],
        properties: [],
      }];
      doc.setDocs(testDocs);

      const result = doc.findParameters('TestClass', 'testMethod');
      expect(result[0].name).toEqual('testParam');
    });

    it('should return empty array if method not found', () => {
      const doc = new Doc();
      const result = doc.findParameters(
        'NonExistentClass',
        'nonExistentMethod',
      );
      expect(result).toEqual([]);
    });
  });
});
