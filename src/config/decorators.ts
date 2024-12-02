import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { ConfigDecoratorException } from './ConfigDecoratorException.ts';

/**
 * Decorator factory that configures a class as a config entity
 *
 * @param options Decorator options
 * @param options.scope The scope type for the config. Defaults to 'config'
 * @param options.singleton Whether the config should be a singleton. Defaults to true
 * @returns The class decorator function
 */
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

/**
 * Validates that a class meets the requirements to be a config entity
 *
 * @param name The name of the config class
 * @param config The config class
 * @throws {ConfigDecoratorException} If validation fails
 */
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
