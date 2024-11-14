export type ValidatorScopeType =
  | 'payload'
  | 'params'
  | 'queries'
  | 'headers'
  | 'cookies'
  | 'response'
  | null;

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
