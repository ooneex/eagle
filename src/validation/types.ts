export const ValidatorScopes = [
  'payload',
  'params',
  'queries',
  'headers',
  'cookies',
  'files',
  'form',
  'env',
] as const;

export type ValidatorScopeType = (typeof ValidatorScopes)[number] | null;

export interface IValidator {
  getScope: () => ValidatorScopeType;
  validate: (data: unknown) => ValidationResultType;
}

export interface IAssert {
  validate: (
    value: unknown,
  ) => { success: boolean; message: string; key?: string };
}

export type ValidationResultType = {
  success: boolean;
  details: {
    property: string;
    success: boolean;
    message: string;
  }[];
};
