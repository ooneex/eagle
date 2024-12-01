import { IncomingMessage } from 'node:http';
import { CreateSmtpEmail } from 'npm:@getbrevo/brevo';

export type BrevoMailerResponseType = {
  response: IncomingMessage;
  body: CreateSmtpEmail;
};

export type SenderType = { email: string; name?: string };
export type DestinationType = { name?: string; email: string };

export interface IMailer {
  send: <T = void>() => Promise<T> | T;
}
