export class Column {
  private type: string;
  private nullable: boolean;
  private isPrimaryKey: boolean;
  private isUnique: boolean;
  private defaultValue?: any;

  constructor(public readonly name: string) {}

  public null(): Column {
    this.nullable = true;
    return this;
  }

  public notNull(): Column {
    this.nullable = false;
    return this;
  }

  public primaryKey(value = false): Column {
    this.isPrimaryKey = value;
    return this;
  }

  public unique(value = false): Column {
    this.isUnique = value;
    return this;
  }

  public default(value: any): Column {
    this.defaultValue = value;
    return this;
  }

  public removeDefault(): Column {
    this.defaultValue = undefined;
    return this;
  }

  public int(): Column {
    this.type = 'INT';
    return this;
  }

  public string(): Column {
    this.type = 'string';
    return this;
  }

  public getCreateSql(): string {
    const q = [this.name, this.type];
    if (this.isPrimaryKey) {
      q.push('PRIMARY KEY');
    }

    q.push(this.nullable ? 'NULL' : 'NOT NULL');

    if (this.isUnique) {
      q.push('UNIQUE');
    }

    if (this.defaultValue !== undefined) {
      q.push(`DEFAULT ${JSON.stringify(this.defaultValue)}`);
    }

    return q.join(' ');
  }

  public getUpdateSql(): string {
    return '';
  }

  public getDeleteSql(): string {
    return '';
  }

  public getDropSql(): string {
    return '';
  }
}
