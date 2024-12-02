import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { MailerDecoratorException } from './MailerDecoratorException.ts';

/**
 * Decorator factory that registers a mailer class with the container.
 * The decorated class must end with 'Mailer' and implement the IMailer interface.
 *
 * @param options Configuration options for the mailer registration
 * @param options.scope The scope to register the mailer under (defaults to 'mailer')
 * @param options.singleton Whether the mailer should be registered as a singleton (defaults to false)
 * @returns Decorator function that registers the mailer class
 */
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

/**
 * Validates that a class is a properly formatted mailer class.
 * Checks that the class name ends with 'Mailer' and implements the send method.
 *
 * @param name The name of the mailer class
 * @param mailer The mailer class to validate
 * @throws MailerDecoratorException if validation fails
 */
const ensureIsMailer = (name: string, mailer: any) => {
  if (!name.endsWith('Mailer') || !mailer.prototype.send) {
    throw new MailerDecoratorException(
      `Mailer decorator can only be used on mailer classes. ${name} must end with Mailer keyword and implement IMailer interface.`,
    );
  }
};
