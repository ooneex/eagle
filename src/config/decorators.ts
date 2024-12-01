import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ConfigDecoratorException } from './ConfigDecoratorException.ts';

export const config = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
  return (config: any) => {
    const name = config.prototype.constructor.name;
    ensureIsConfig(name, config);

    container.add(name, config, {
      scope: options?.scope ?? 'config',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

const ensureIsConfig = (name: string, config: any) => {
  if (
    !name.endsWith('Config') ||
    !config.prototype.toJson
  ) {
    throw new ConfigDecoratorException(
      `Config decorator can only be used on config classes. ${name} must end with Config keyword and implement IConfig interface.`,
    );
  }
};
