import type { WhereArgsType } from './types';

export function buildWhereClause<Entity>(
  clauses: {
    clause: WhereArgsType<Entity, any>;
    operator: 'AND' | 'OR';
  }[],
): string {
  let query = ' WHERE ';

  for (const clause of clauses) {
    const operator = clause.clause[1];

    if (operator === 'BETWEEN' || operator === 'NOT BETWEEN') {
      const left = JSON.stringify(clause.clause[2][0]);
      const right = JSON.stringify(clause.clause[2][1]);
      query += ` ${clause.operator} ${clause.clause[0].toString()} ${clause.clause[1]} ${left} AND ${right}`;
      continue;
    }

    if (operator === 'IN' || operator === 'NOT IN') {
      const content = clause.clause[2].map((item) => JSON.stringify(item));
      query += ` ${clause.operator} ${clause.clause[0].toString()} ${clause.clause[1]} (${content.join(', ')})`;
      continue;
    }

    if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
      query += ` ${clause.operator} ${clause.clause[0] as string} ${clause.clause[1]}`;
      continue;
    }

    query += ` ${clause.operator} ${clause.clause[0] as string} ${clause.clause[1]} ${JSON.stringify(clause.clause[2])}`;
  }

  return query
    .replace(' WHERE  OR ', ' WHERE ')
    .replace(' WHERE  AND ', ' WHERE ')
    .trim();
}
