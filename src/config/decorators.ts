import { ConfigDecoratorException } from '@/config/ConfigDecoratorException.ts';
import { container } from '@/container/Container.ts';

export const config = () => {
  return (config: unknown, context: ClassDecoratorContext) => {
    ensureIsConfig(context, config);

    container.add(context.name!, config, {
      scope: 'config',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsConfig = (context: ClassDecoratorContext, config: unknown) => {
  if (
    context.kind !== 'class' ||
    !context.name?.endsWith('Config') ||
    !(config as any).prototype.toJson
  ) {
    throw new ConfigDecoratorException(
      `Config decorator can only be used on config classes. ${context.name} must end with Config keyword and implement IConfig interface.`,
    );
  }
};
