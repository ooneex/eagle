import { IncomingMessage } from 'node:http';
import { CreateSmtpEmail } from 'npm:@getbrevo/brevo@2.2.0';

/**
 * Response type for Brevo mailer operations
 */
export type BrevoMailerResponseType = {
  response: IncomingMessage;
  body: CreateSmtpEmail;
};

/**
 * Type definition for email sender
 */
export type SenderType = { email: string; name?: string };

/**
 * Type definition for email recipient
 */
export type DestinationType = { name?: string; email: string };

/**
 * Interface for mailer implementations
 */
export interface IMailer {
  /**
   * Sends an email
   * @returns Promise or direct value of type T
   */
  send: <T = void>() => Promise<T> | T;
}
