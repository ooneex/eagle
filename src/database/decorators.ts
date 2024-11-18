import { DataSource } from 'npm:typeorm';
import { container } from '../container/Container.ts';
import { ServiceDecoratorException } from '../service/ServiceDecoratorException.ts';

export const database = () => {
    return (database: any) => {
        const name = database.prototype.constructor.name;
        ensureIsDatabase(name, database);

        const dataSource = new DataSource({
            type: database.getType(),
            url: database.getConnectionUrl(),
            synchronize: false,
            logging: database.logging(),
            entities: database.getEntities(),
            migrations: database.getMigrations(),
            subscribers: database.getSubscribers(),
        });

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
        !database.prototype.getType ||
        !database.prototype.getConnectionUrl ||
        !database.prototype.getEntities ||
        !database.prototype.getMigrations ||
        !database.prototype.logging
    ) {
        throw new ServiceDecoratorException(
            `Database decorator can only be used on database classes. ${name} must end with Database keyword and implement IDatabase interface.`,
        );
    }
};
