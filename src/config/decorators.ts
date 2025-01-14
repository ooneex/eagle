import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { injectable } from 'node_modules/inversify/lib/cjs/annotation/injectable';
import { ConfigDecoratorException } from './ConfigDecoratorException.ts';

export const config = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (config: any) => {
    const name = config.prototype.constructor.name;
    ensureIsConfig(name, config);

    injectable()(config);

    if (options?.scope === 'transient') {
      container.bind(config).toSelf().inTransientScope();
    } else {
      container.bind(config).toSelf().inSingletonScope();
    }
  };
};

const ensureIsConfig = (name: string, config: any): void => {
  if (!name.endsWith('Config') || !config.prototype.toJson) {
    throw new ConfigDecoratorException(
      `Config decorator can only be used on config classes. ${name} must end with Config keyword and implement IConfig interface.`,
    );
  }
};
