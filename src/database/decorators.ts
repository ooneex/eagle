import { container } from '@/container/Container.ts';
import { ServiceDecoratorException } from '@/service/ServiceDecoratorException.ts';
import { DataSource } from '@typeorm';

export const database = () => {
  return (database: any, context: ClassDecoratorContext) => {
    ensureIsDatabase(context, database);

    const dataSource = new DataSource({
      type: database.getType(),
      url: database.getConnectionUrl(),
      synchronize: false,
      logging: database.logging(),
      entities: database.getEntities(),
      migrations: database.getMigrations(),
      subscribers: database.getSubscribers(),
    });

    container.add(context.name!, dataSource, {
      scope: 'database',
      singleton: true,
      instance: true,
    });
  };
};

const ensureIsDatabase = (
  context: ClassDecoratorContext,
  database: any,
) => {
  if (
    context.kind !== 'class' ||
    !context.name?.endsWith('Database') ||
    !database.prototype.getType ||
    !database.prototype.getConnectionUrl ||
    !database.prototype.getEntities ||
    !database.prototype.getMigrations ||
    !database.prototype.logging
  ) {
    throw new ServiceDecoratorException(
      `Database decorator can only be used on database classes. ${context.name} must end with Database keyword and implement IDatabase interface.`,
    );
  }
};
