import { buildInsertQuery } from './buildInsertQuery';
import { buildWhereClause } from './buildWhereClause';
import { snakeCase } from './snakeCase';
import type {
  ClauseWithAggregateArgsType,
  FieldValueType,
  GroupByField,
  InsertFieldArgType,
  JoinArgsType,
  OrderByArgsType,
  SelectableFields,
  WhereArgsType,
} from './types';
import { formatValueForDatabase } from './valueFormatter';

export class QueryBuilder<
  Entity extends { [K in keyof Entity]: Entity[K] },
  Table extends string = string,
> {
  private selectFields: {
    select: SelectableFields<Entity, Table>;
    distinct: boolean;
  } | null = null;
  private whereClauses: {
    clause: WhereArgsType<Entity, Table>;
    operator: 'AND' | 'OR';
  }[] = [];
  private havingClauses: ClauseWithAggregateArgsType<Entity, Table>[] = [];
  private groupByField: GroupByField<Entity, Table> | null = null;
  private orderByClause: {
    clause: OrderByArgsType<Entity, Table>;
    direction: 'ASC' | 'DESC';
  }[] = [];
  private limitClause: number | null = null;
  private offsetClause: number | null = null;
  private joins: {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    left: JoinArgsType<Entity, Table>;
    right: JoinArgsType<Entity, Table>;
  }[] = [];
  private dataToInsert: Record<string, FieldValueType[]> | null = null;
  private dataToUpdate: Record<string, FieldValueType | null> | null = null;
  private shouldDelete = false;

  constructor(private readonly table: Table) {}

  public update<T extends InsertFieldArgType<Entity>>(
    field: T,
    value: Entity[T] | null,
  ): QueryBuilder<Entity, Table> {
    if (!this.dataToUpdate) {
      this.dataToUpdate = {};
    }

    this.dataToUpdate[field as string] = value;

    return this;
  }

  public insert<T extends InsertFieldArgType<Entity>>(
    field: T,
    value: Entity[T],
  ): QueryBuilder<Entity, Table> {
    if (!this.dataToInsert) {
      this.dataToInsert = {};
    }

    if (!this.dataToInsert[field as string]) {
      this.dataToInsert[field as string] = [];
    }

    this.dataToInsert[field as string].push(value);

    return this;
  }

  public join(
    table: Table,
    left: JoinArgsType<Entity, Table>,
    right: JoinArgsType<Entity, Table>,
  ): QueryBuilder<Entity, Table> {
    this.joins.push({
      type: 'INNER',
      table,
      left,
      right,
    });

    return this;
  }

  public leftJoin(
    table: Table,
    left: JoinArgsType<Entity, Table>,
    right: JoinArgsType<Entity, Table>,
  ): QueryBuilder<Entity, Table> {
    this.joins.push({
      type: 'LEFT',
      table,
      left,
      right,
    });
    return this;
  }

  public rightJoin(
    table: Table,
    left: JoinArgsType<Entity, Table>,
    right: JoinArgsType<Entity, Table>,
  ): QueryBuilder<Entity, Table> {
    this.joins.push({
      type: 'RIGHT',
      table,
      left,
      right,
    });
    return this;
  }

  public fullJoin(
    table: Table,
    left: JoinArgsType<Entity, Table>,
    right: JoinArgsType<Entity, Table>,
  ): QueryBuilder<Entity, Table> {
    this.joins.push({
      type: 'FULL',
      table,
      left,
      right,
    });
    return this;
  }

  public select(
    ...fields: SelectableFields<Entity, Table>
  ): QueryBuilder<Entity, Table> {
    this.selectFields = {
      select: fields,
      distinct: false,
    };

    return this;
  }

  public selectDistinct(
    ...fields: SelectableFields<Entity, Table>
  ): QueryBuilder<Entity, Table> {
    this.selectFields = {
      select: fields,
      distinct: true,
    };

    return this;
  }

  public where(
    ...clause: WhereArgsType<Entity, Table>
  ): QueryBuilder<Entity, Table> {
    this.whereClauses.push({
      clause,
      operator: 'OR',
    });

    return this;
  }

  public delete(): QueryBuilder<Entity, Table> {
    this.shouldDelete = true;

    return this;
  }

  public andWhere(
    ...clause: WhereArgsType<Entity, Table>
  ): QueryBuilder<Entity, Table> {
    this.whereClauses.push({
      clause,
      operator: 'AND',
    });

    return this;
  }

  public groupBy(
    field: GroupByField<Entity, Table>,
  ): QueryBuilder<Entity, Table> {
    this.groupByField = field;

    return this;
  }

  public having(
    ...clause: ClauseWithAggregateArgsType<Entity, Table>
  ): QueryBuilder<Entity, Table> {
    this.havingClauses.push(clause);

    return this;
  }

  public orderBy(
    clause: OrderByArgsType<Entity, Table>,
    direction: 'ASC' | 'DESC' = 'ASC',
  ): QueryBuilder<Entity, Table> {
    this.orderByClause.push({
      clause,
      direction,
    });

    return this;
  }

  public limit(limit: number): QueryBuilder<Entity, Table> {
    this.limitClause = limit;

    return this;
  }

  public offset(offset: number): QueryBuilder<Entity, Table> {
    this.offsetClause = offset;

    return this;
  }

  public getSql(): string {
    if (this.dataToInsert) {
      return buildInsertQuery(this.table, this.dataToInsert);
    }

    let query = '';

    if (this.dataToUpdate) {
      const data = Object.entries(this.dataToUpdate).map(([field, value]) => {
        let v = JSON.stringify(formatValueForDatabase(value));
        if (v === 'null') {
          v = 'NULL';
        }
        return `${field} = ${v}`;
      });
      query += ` UPDATE ${this.table} SET ${data.join(', ')}`;
    }

    if (this.shouldDelete) {
      query = `DELETE FROM ${this.table}`;
    }

    if (this.selectFields) {
      query += `SELECT ${this.selectFields.distinct ? 'DISTINCT ' : ''}`;
      query += `${this.selectFields?.select
        .map((field) => {
          const parts = field.toString().split(' AS ');
          parts[0] = snakeCase(parts[0]);

          return parts.join(' AS ');
        })
        .join(', ')} FROM ${this.table}`;
    }

    if (this.whereClauses.length > 0) {
      query += ` ${buildWhereClause(this.whereClauses)} `;
    }

    if (this.groupByField) {
      query += ` GROUP BY ${this.groupByField.toString()}`;
    }

    if (this.havingClauses.length > 0) {
      query += ' HAVING ';

      query += this.havingClauses
        .map(
          (clause) =>
            `${clause[0].toString()} ${clause[1]} ${JSON.stringify(clause[2])}`,
        )
        .join(' OR ');
    }

    if (this.orderByClause.length > 0) {
      query += ` ORDER BY ${this.orderByClause
        .map(
          (clause) =>
            `${snakeCase(clause.clause.toString())} ${clause.direction}`,
        )
        .join(', ')}`;
    }

    if (this.limitClause) {
      query += ` LIMIT ${this.limitClause}`;
    }

    if (this.offsetClause) {
      query += ` OFFSET ${this.offsetClause}`;
    }

    if (this.joins.length > 0) {
      query += ` ${this.joins
        .map((join) => {
          const left = snakeCase(join.left.toString());
          const right = snakeCase(join.right.toString());

          return `${join.type} JOIN ${join.table} ON ${left} = ${right}`;
        })
        .join(' ')}`;
    }

    return `${query.trim()};`;
  }
}
