import { isLitteralObject } from '../helper/isLitteralObject';
import type { FieldValueType } from './types';

export const formatValueForDatabase = (value: FieldValueType): any => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((v) => {
      return formatValueForDatabase(v);
    });
  }

  if (isLitteralObject(value)) {
    Object.keys(value as any).map((k) => {
      // @ts-expect-error
      value[k] = formatValueForDatabase(value[k]);
    });
  }

  return value;
};
