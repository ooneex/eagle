import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { ConfigDecoratorException } from './ConfigDecoratorException.ts';

export const config = (options?: DecoratorScopeType): ClassDecorator => {
  return (config: any) => {
    const name = config.prototype.constructor.name;
    ensureIsConfig(name, config);

    if (options?.scope === 'request') {
      container.bind(config).toSelf().inRequestScope();
    } else if (options?.scope === 'transient') {
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
