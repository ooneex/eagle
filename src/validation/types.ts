import type { ValidationError, ValidatorOptions } from 'class-validator';

export const ValidatorScopes = [
  'payload',
  'params',
  'queries',
  'cookies',
  'files',
  'form',
] as const;

export type ValidatorScopeType = (typeof ValidatorScopes)[number];

export interface IValidator {
  validate: (
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ) => Promise<ValidationResultType> | ValidationResultType;
  validateSync: (
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ) => ValidationResultType;
  beforeValidate?: (data: Record<string, unknown>) => Record<string, unknown>;
  afterValidate?: (data: Record<string, unknown>) => void;
}

export type AssertValidateReturnType = {
  success: boolean;
  message: string;
  key?: string;
};

export type ValidationResultType = {
  success: boolean;
  logs: ValidationError[];
  details: {
    property: string;
    value: string;
    constraints: { name: string; message: string }[];
  }[];
};
