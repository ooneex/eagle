import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { MailerDecoratorException } from './MailerDecoratorException.ts';

export const mailer = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}) => {
  return (mailer: any) => {
    const name = mailer.prototype.constructor.name;
    ensureIsMailer(name, mailer);

    container.add(name!, mailer, {
      scope: options?.scope ?? 'mailer',
      singleton: options?.singleton ?? false,
      instance: false,
    });
  };
};

const ensureIsMailer = (name: string, mailer: any) => {
  if (!name.endsWith('Mailer') || !mailer.prototype.send) {
    throw new MailerDecoratorException(
      `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword and implement IMailer interface.`,
    );
  }
};
