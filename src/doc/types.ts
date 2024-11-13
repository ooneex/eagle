export type PropertyDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
  isReadonly: boolean;
  accessibility: 'public' | 'protected' | 'private';
  isAbstract: boolean;
  isStatic: boolean;
};

export type ConstructorParamDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
  isReadonly: boolean;
  accessibility: 'public' | 'protected' | 'private';
};

export type ConstructorDocType = {
  name: string;
  accessibility: 'public' | 'protected' | 'private' | null;
  parameters: ConstructorParamDocType[];
};

export type MethodParamDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
};

export type MethodDocType = {
  name: string;
  isAbstract: boolean;
  isStatic: boolean;
  isOptional: boolean;
  isAsync: boolean;
  isGenerator: boolean;
  accessibility: 'public' | 'protected' | 'private';
  returnType: string | null;
  parameters: MethodParamDocType[];
};

export type ClassDocType = {
  name: string;
  isExported: boolean;
  isDefault: boolean;
  isAbstract: boolean;
  constructor: ConstructorDocType | null;
  properties: PropertyDocType[];
  methods: MethodDocType[];
};

export type IDoc = {
  setDocs: (docs: ClassDocType[]) => void;
  parse: () => Promise<ClassDocType[]>;
  findClasses: (
    criteria?:
      & Partial<
        Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
      >
      & {
        name?: string | RegExp;
        constructor?:
          & Partial<Omit<ConstructorDocType, 'name' | 'parameters'>>
          & {
            name?: string | RegExp;
            parameters?: Partial<Omit<ConstructorParamDocType, 'name'>> & {
              name?: string | RegExp;
            };
          };
        properties?: Partial<Omit<PropertyDocType, 'name'>> & {
          name?: string | RegExp;
        };
        methods?: Partial<Omit<MethodDocType, 'name' | 'parameters'>> & {
          name?: string | RegExp;
          parameters?: Partial<Omit<MethodParamDocType, 'name'>> & {
            name?: string | RegExp;
          };
        };
      },
  ) => ClassDocType[];
  findConstructors: (
    criteria?: Partial<Omit<ConstructorDocType, 'name' | 'parameters'>> & {
      name?: string | RegExp;
      parameters?: Partial<Omit<ConstructorParamDocType, 'name'>> & {
        name?: string | RegExp;
      };
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
    },
  ) => ConstructorDocType[];
  findProperties: (
    criteria?: Partial<Omit<PropertyDocType, 'name'>> & {
      name?: string | RegExp;
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
    },
  ) => PropertyDocType[];
  findMethods: (
    criteria?: Partial<Omit<MethodDocType, 'name' | 'parameters'>> & {
      name?: string | RegExp;
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
      parameters?: Partial<Omit<MethodParamDocType, 'name'>> & {
        name?: string | RegExp;
      };
    },
  ) => MethodDocType[];
  findParameters: (
    className: string,
    methodName: string,
  ) => MethodParamDocType[];
};
