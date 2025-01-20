import type {
  SendSmtpEmailAttachmentInner,
  SendSmtpEmailBccInner,
  SendSmtpEmailCcInner,
  SendSmtpEmailMessageVersionsInner,
  SendSmtpEmailReplyTo,
} from '@getbrevo/brevo';
import { MailerException } from './MailerException';
import { mailer } from './decorators';
import type {
  BrevoMailerResponseType,
  DestinationType,
  IMailer,
  SenderType,
} from './types';

import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@getbrevo/brevo';

@mailer()
export class BrevoMailer implements IMailer {
  private sender: SenderType | null = null;
  private to: DestinationType[] = [];
  private cc: SendSmtpEmailCcInner[] = [];
  private bcc: SendSmtpEmailBccInner[] = [];
  private htmlContent: string | null = null;
  private textContent: string | null = null;
  private subject: string | null = null;
  private replyTo: SendSmtpEmailReplyTo | null = null;
  private attachments: SendSmtpEmailAttachmentInner[] = [];
  private headers: object | null = null;
  private templateId: number | null = null;
  private params: object | null = null;
  private messageVersions: SendSmtpEmailMessageVersionsInner[] = [];
  private tags: string[] = [];
  private scheduledAt: Date | null = null;
  private batchId: string | null = null;

  public setSender(email: string, name?: string): this {
    this.sender = { email, name };

    return this;
  }

  public getSender(): SenderType | null {
    return this.sender;
  }

  public setDestinations(to: DestinationType[]): this {
    this.to = to;

    return this;
  }

  public getDestinations(): DestinationType[] {
    return this.to;
  }

  public addDestination(to: DestinationType): this {
    this.to.push(to);

    return this;
  }

  public setBcc(bcc: SendSmtpEmailBccInner[]): this {
    this.bcc = bcc;
    return this;
  }

  public getBcc(): SendSmtpEmailBccInner[] {
    return this.bcc;
  }

  public addBcc(bcc: SendSmtpEmailBccInner): this {
    this.bcc.push(bcc);
    return this;
  }

  public setCc(cc: SendSmtpEmailCcInner[]): this {
    this.cc = cc;
    return this;
  }

  public getCc(): SendSmtpEmailCcInner[] {
    return this.cc;
  }

  public addCc(cc: SendSmtpEmailCcInner): this {
    this.cc.push(cc);
    return this;
  }

  public setHtmlContent(content: string): this {
    this.htmlContent = content;
    return this;
  }

  public getHtmlContent(): string | null {
    return this.htmlContent;
  }

  public setTextContent(content: string): this {
    this.textContent = content;
    return this;
  }

  public getTextContent(): string | null {
    return this.textContent;
  }

  public setSubject(subject: string): this {
    this.subject = subject;
    return this;
  }

  public getSubject(): string | null {
    return this.subject;
  }

  public setReplyTo(replyTo: SendSmtpEmailReplyTo): this {
    this.replyTo = replyTo;
    return this;
  }

  public getReplyTo(): SendSmtpEmailReplyTo | null {
    return this.replyTo;
  }

  public setAttachment(attachment: SendSmtpEmailAttachmentInner[]): this {
    this.attachments = attachment;
    return this;
  }

  public getAttachments(): SendSmtpEmailAttachmentInner[] {
    return this.attachments;
  }

  public addAttachment(attachment: SendSmtpEmailAttachmentInner): this {
    this.attachments.push(attachment);
    return this;
  }

  public setHeaders(headers: object): this {
    this.headers = headers;
    return this;
  }

  public getHeaders(): object | null {
    return this.headers;
  }

  public setTemplateId(templateId: number): this {
    this.templateId = templateId;
    return this;
  }

  public getTemplateId(): number | null {
    return this.templateId;
  }

  public setParams(params: object): this {
    this.params = params;
    return this;
  }

  public getParams(): object | null {
    return this.params;
  }

  public setMessageVersions(
    versions: SendSmtpEmailMessageVersionsInner[],
  ): this {
    this.messageVersions = versions;
    return this;
  }

  public getMessageVersions(): SendSmtpEmailMessageVersionsInner[] {
    return this.messageVersions;
  }

  public addMessageVersion(version: SendSmtpEmailMessageVersionsInner): this {
    this.messageVersions.push(version);
    return this;
  }

  public setTags(tags: string[]): this {
    this.tags = tags;
    return this;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public addTag(tag: string): this {
    this.tags.push(tag);
    return this;
  }

  public setScheduledAt(date: Date): this {
    this.scheduledAt = date;
    return this;
  }

  public getScheduledAt(): Date | null {
    return this.scheduledAt;
  }

  public setBatchId(id: string): this {
    this.batchId = id;
    return this;
  }

  public getBatchId(): string | null {
    return this.batchId;
  }

  public async send<T = BrevoMailerResponseType>(key?: string): Promise<T> {
    key = key ?? process.env.BREVO_API_KEY;

    if (!key) {
      throw new MailerException('Brevo mailer credentials are not set');
    }

    const client = new TransactionalEmailsApi();

    client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, key);

    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.sender = this.sender ?? undefined;
    sendSmtpEmail.to = this.to ?? undefined;
    sendSmtpEmail.bcc = this.bcc ?? undefined;
    sendSmtpEmail.cc = this.cc ?? undefined;
    sendSmtpEmail.htmlContent = this.htmlContent ?? undefined;
    sendSmtpEmail.textContent = this.textContent ?? undefined;
    sendSmtpEmail.subject = this.subject ?? undefined;
    sendSmtpEmail.replyTo = this.replyTo ?? undefined;
    sendSmtpEmail.attachment = this.attachments ?? undefined;
    sendSmtpEmail.headers = this.headers ?? undefined;
    sendSmtpEmail.templateId = this.templateId ?? undefined;
    sendSmtpEmail.params = this.params ?? undefined;
    sendSmtpEmail.messageVersions = this.messageVersions ?? undefined;
    sendSmtpEmail.tags = this.tags ?? undefined;
    sendSmtpEmail.scheduledAt = this.scheduledAt ?? undefined;
    sendSmtpEmail.batchId = this.batchId ?? undefined;

    return (await client.sendTransacEmail(sendSmtpEmail)) as T;
  }
}
