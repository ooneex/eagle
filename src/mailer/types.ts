import type { IncomingMessage } from 'node:http';
import type { CreateSmtpEmail } from '@getbrevo/brevo';

export type BrevoMailerResponseType = {
  response: IncomingMessage;
  body: CreateSmtpEmail;
};

export type SenderType = { email: string; name?: string };

export type DestinationType = { name?: string; email: string };

export interface IMailer {
  send: <T = any>() => Promise<T> | T;
}
