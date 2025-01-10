import type { ValidationError, ValidatorOptions } from 'class-validator';

export const ValidatorScopes = [
  'payload',
  'params',
  'queries',
  'cookies',
  'files',
  'form',
  'env',
] as const;

export type ValidatorScopeType = (typeof ValidatorScopes)[number];

export interface IValidator {
  validate: (
    validatorOptions?: ValidatorOptions,
  ) => Promise<ValidationResultType> | ValidationResultType;
}

export type AssertValidateReturnType = {
  success: boolean;
  message: string;
  key?: string;
};

export type ValidationResultType = {
  success: boolean;
  details: ValidationError[];
};
