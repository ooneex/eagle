import { container } from '../container/Container.ts';
import { MailerDecoratorException } from './MailerDecoratorException.ts';

export const mailer = () => {
  return (mailer: any) => {
    const name = mailer.prototype.constructor.name;
    ensureIsMailer(name, mailer);

    container.add(name!, mailer, {
      scope: 'mailer',
      singleton: true,
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
