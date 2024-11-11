export type PropertyDocType = {
  name: string;
  type: string;
  isOptional: boolean;
  isReadonly: boolean;
  accessibility: 'public' | 'protected' | 'private';
  isAbstract: boolean;
  isStatic: boolean;
};

export type ConstructorParamDocType = {
  name: string;
  type: string;
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
  type: string;
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
