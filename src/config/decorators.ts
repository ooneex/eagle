import { ConfigDecoratorException } from '@/config/ConfigDecoratorException.ts';
import { container } from '@/container/Container.ts';

export const config = () => {
  return (config: any) => {
    const name = config.prototype.constructor.name;
    ensureIsConfig(name, config);

    if (name) {
      container.add(name, config, {
        scope: 'config',
        singleton: true,
        instance: false,
      });
    }
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
