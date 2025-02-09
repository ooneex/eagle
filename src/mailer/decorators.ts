import { container } from '../container';
import type { DecoratorScopeType } from '../types';
import { MailerDecoratorException } from './MailerDecoratorException';

export const mailer = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (mailer: any) => {
    const name = mailer.prototype.constructor.name;
    ensureIsMailer(name, mailer);

    if (options?.scope === 'transient') {
      container.bind(mailer).toSelf().inTransientScope();
    } else {
      container.bind(mailer).toSelf().inSingletonScope();
    }
  };
};

const ensureIsMailer = (name: string, mailer: any): void => {
  if (!name.endsWith('Mailer') || !mailer.prototype.send) {
    throw new MailerDecoratorException(
      `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword and implement IMailer interface.`,
    );
  }
};
