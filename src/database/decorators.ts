import { container } from '../container/Container.ts';
import { ServiceDecoratorException } from '../service/ServiceDecoratorException.ts';

export const database = () => {
  return (database: any) => {
    const name = database.prototype.constructor.name;
    ensureIsDatabase(name, database);

    const dataSource = database.getDataSource();

    container.add(name, dataSource.initialize(), {
      scope: 'database',
      singleton: true,
      instance: true,
    });
  };
};

const ensureIsDatabase = (name: string, database: any) => {
  if (
    !name?.endsWith('Database') ||
    !database.prototype.getDataSource
  ) {
    throw new ServiceDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword and implement IDatabase interface.`,
    );
  }
};
