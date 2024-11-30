import { IncomingMessage } from 'node:http';
import { CreateSmtpEmail } from 'npm:@getbrevo/brevo';

export type BrevoMailerResponseType = {
  response: IncomingMessage;
  body: CreateSmtpEmail;
};

export interface IMailer {
  send: <T = unknown>() => Promise<T> | T;
}
