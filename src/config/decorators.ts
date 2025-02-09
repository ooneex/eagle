import { container } from '../container/container';
import type { DecoratorScopeType } from '../types';
import { ConfigDecoratorException } from './ConfigDecoratorException';

export const config = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (config: any) => {
    const name = config.prototype.constructor.name;
    ensureIsConfig(name, config);

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
