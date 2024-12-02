/**
 * Represents the documentation for a class property
 */
export type PropertyDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
  isReadonly: boolean;
  accessibility: 'public' | 'protected' | 'private';
  isAbstract: boolean;
  isStatic: boolean;
};

/**
 * Represents the documentation for a constructor parameter
 */
export type ConstructorParamDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
  isReadonly: boolean;
  accessibility: 'public' | 'protected' | 'private';
};

/**
 * Represents the documentation for a class constructor
 */
export type ConstructorDocType = {
  name: string;
  accessibility: 'public' | 'protected' | 'private' | null;
  parameters: ConstructorParamDocType[];
};

/**
 * Represents the documentation for a method parameter
 */
export type MethodParamDocType = {
  name: string;
  types: string[];
  isOptional: boolean;
};

/**
 * Represents the documentation for a class method
 */
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

/**
 * Represents the complete documentation for a class
 */
export type ClassDocType = {
  name: string;
  isExported: boolean;
  isDefault: boolean;
  isAbstract: boolean;
  constructor: ConstructorDocType | null;
  properties: PropertyDocType[];
  methods: MethodDocType[];
};

/**
 * Interface for documentation parsing and querying functionality
 */
export type IDoc = {
  /**
   * Sets the documentation data
   */
  setDocs: (docs: ClassDocType[]) => void;

  /**
   * Parses source code to generate documentation
   */
  parse: () => Promise<ClassDocType[]>;

  /**
   * Finds classes matching specified criteria
   */
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

  /**
   * Finds constructors matching specified criteria
   */
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

  /**
   * Finds properties matching specified criteria
   */
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

  /**
   * Finds methods matching specified criteria
   */
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

  /**
   * Finds parameters for a specified class method
   */
  findParameters: (
    className: string,
    methodName: string,
  ) => MethodParamDocType[];
};
