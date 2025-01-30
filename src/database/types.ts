export type RelationType<R> = {
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  field: string;
  reverse?: GetEntityProperties<R>;
  join?: {
    table?: string;
    column?: string;
  };
};

export interface IEntity {
  id: string | number;
  getRelations?: () => RelationType<any> | RelationType<any>[];
}

export type FieldSimpleValueType = string | number | boolean | Date | null;
export type FieldValueType =
  | FieldSimpleValueType
  | FieldSimpleValueType[]
  | Record<string, FieldSimpleValueType | FieldSimpleValueType[]>;

export type AggregateFunctionType = 'MIN' | 'MAX' | 'COUNT' | 'SUM' | 'AVG';

export type GetEntityProperties<Entity> = {
  [K in keyof Entity]: Entity[K] extends FieldValueType ? K : never;
}[keyof Entity];

export type SelectableFields<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Alias extends `${string | number}` | null = null,
> =
  | ['*']
  // | [`* AS ${string | number}`]
  // | [`${AggregateFunctionType}(*)`]
  // | [`${AggregateFunctionType}(*) AS ${string | number}`]
  | (
      | `${AggregateFunctionType}(*)`
      | `${AggregateFunctionType}(*) AS ${string | number}`
      | Exclude<GetEntityProperties<Entity>, symbol>
      | `${Alias}.${Exclude<GetEntityProperties<Entity>, symbol>}`
      | `${Exclude<GetEntityProperties<Entity>, symbol>} AS ${string | number}`
      | `${Alias}.${Exclude<GetEntityProperties<Entity>, symbol>} AS ${string | number}`
      | `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol>})`
      | `${AggregateFunctionType}(${Alias}.${Exclude<GetEntityProperties<Entity>, symbol>})`
      | `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol>}) AS ${string | number}`
      | `${AggregateFunctionType}(${Alias}.${Exclude<GetEntityProperties<Entity>, symbol>}) AS ${string | number}`
    )[];

export type GroupByField<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Table extends `${string | number}`,
> =
  | GetEntityProperties<Entity>
  | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`;

export type ClauseOperatorType = '<' | '<=' | '>' | '>=' | '=' | '!=';
export type ClauseBetweenOperatorType = 'BETWEEN' | 'NOT BETWEEN';
export type ClauseInOperatorType = 'IN' | 'NOT IN';
export type ClauseNullOperatorType = 'IS NULL' | 'IS NOT NULL';
export type ClauseLikeOperatorType = 'LIKE' | 'NOT LIKE';

export type JoinArgsType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Table extends `${string | number}`,
> =
  | GetEntityProperties<Entity>
  | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`;

export type UpdateDeleteArgsType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
> =
  | {
      [K in GetEntityProperties<Entity>]: [
        GetEntityProperties<Entity>,
        ClauseOperatorType,
        Entity[K],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        GetEntityProperties<Entity>,
        ClauseBetweenOperatorType,
        [Entity[K], Entity[K]],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        GetEntityProperties<Entity>,
        ClauseInOperatorType,
        Entity[K][],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        GetEntityProperties<Entity>,
        ClauseLikeOperatorType,
        string,
      ];
    }[GetEntityProperties<Entity>]
  | [GetEntityProperties<Entity>, ClauseNullOperatorType];

export type WhereArgsType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Table extends `${string | number}`,
> =
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseOperatorType,
        Entity[K],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseBetweenOperatorType,
        [Entity[K], Entity[K]],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseInOperatorType,
        Entity[K][],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseLikeOperatorType,
        string,
      ];
    }[GetEntityProperties<Entity>]
  | [
      (
        | GetEntityProperties<Entity>
        | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
      ),
      ClauseNullOperatorType,
    ];

export type ClauseWithAggregateArgsType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Table extends `${string | number}`,
> =
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseOperatorType,
        Entity[K],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol> | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}` | '*'})`,
        ClauseOperatorType,
        number | string,
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseBetweenOperatorType,
        [Entity[K], Entity[K]],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol> | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}` | '*'})`,
        ClauseBetweenOperatorType,
        [number | string, number | string],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        (
          | GetEntityProperties<Entity>
          | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`
        ),
        ClauseInOperatorType,
        Entity[K][],
      ];
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: [
        `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol> | `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}` | '*'})`,
        ClauseInOperatorType,
        (number | string)[],
      ];
    }[GetEntityProperties<Entity>]
  | [GetEntityProperties<Entity>, ClauseNullOperatorType];

export type OrderByArgsType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
  Table extends `${string | number}`,
> =
  | {
      [K in GetEntityProperties<Entity>]: GetEntityProperties<Entity>;
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: `${Table}.${Exclude<GetEntityProperties<Entity>, symbol>}`;
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: `${AggregateFunctionType}(${Exclude<GetEntityProperties<Entity>, symbol>})`;
    }[GetEntityProperties<Entity>]
  | {
      [K in GetEntityProperties<Entity>]: `${AggregateFunctionType}(${Table}.${Exclude<GetEntityProperties<Entity>, symbol>})`;
    }[GetEntityProperties<Entity>];

export type InsertFieldArgType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
> = {
  [K in GetEntityProperties<Entity>]: GetEntityProperties<Entity>;
}[GetEntityProperties<Entity>];

export type InsertValueArgType<
  Entity extends { [K in GetEntityProperties<Entity>]: Entity[K] },
> = {
  [K in GetEntityProperties<Entity>]: Entity[K];
}[GetEntityProperties<Entity>];
