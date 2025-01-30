import type { FieldValueType } from './types';
import { formatValueForDatabase } from './valueFormatter';

export const buildInsertQuery = (
  tableName: string,
  data: Record<string, FieldValueType[]>,
): string => {
  let query = '';

  query += `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES `;
  const structuredValues: FieldValueType[][] = [];
  Object.values(data).map((value) => {
    value.map((v, index) => {
      if (!structuredValues[index]) {
        structuredValues[index] = [];
      }

      structuredValues[index].push(JSON.stringify(formatValueForDatabase(v)));
    });
  });

  query += structuredValues
    .map((value) => {
      return `(${value.join(', ')})`;
    })
    .join(', ');

  return `${query};`;
};
