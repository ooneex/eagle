import { EnvConfig } from '@/config/EnvConfig.ts';
import { MailerException } from '@/mailer/MailerException.ts';
import { service } from '@/service/decorators.ts';
import {
  CreateSmtpEmail,
  SendSmtpEmail,
  SendSmtpEmailAttachmentInner,
  SendSmtpEmailBccInner,
  SendSmtpEmailCcInner,
  SendSmtpEmailMessageVersionsInner,
  SendSmtpEmailReplyTo,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from '@brevo';
import { IncomingMessage } from 'node:http';

export type SenderType = { email: string; name?: string };
export type ToType = { name?: string; email: string };

@service()
export class BrevoMailerAdapterService {
  private client: TransactionalEmailsApi;
  private sender: SenderType | null = null;
  private to: ToType[] = [];
  private bcc: SendSmtpEmailBccInner[] = [];
  private cc: SendSmtpEmailCcInner[] = [];
  private htmlContent: string | null = null;
  private textContent: string | null = null;
  private subject: string | null = null;
  private replyTo: SendSmtpEmailReplyTo | null = null;
  private attachment: SendSmtpEmailAttachmentInner[] = [];
  private headers: object | null = null;
  private templateId: number | null = null;
  private params: object | null = null;
  private messageVersions: SendSmtpEmailMessageVersionsInner[] = [];
  private tags: string[] = [];
  private scheduledAt: Date | null = null;
  private batchId: string | null = null;

  constructor() {
    const key = Deno.env.get(EnvConfig.KEYS.mailer.brevo.key);

    if (!key) {
      throw new MailerException('Mailer credentials are not set');
    }

    this.client = new TransactionalEmailsApi();

    this.client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      key,
    );
  }

  public setSender(email: string, name?: string): this {
    this.sender = { email, name };

    return this;
  }

  public getSender(): SenderType | null {
    return this.sender;
  }

  public setTo(to: ToType[]): this {
    this.to = to;

    return this;
  }

  public getTo(): ToType[] {
    return this.to;
  }

  public addTo(to: ToType): this {
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
    this.attachment = attachment;
    return this;
  }

  public getAttachment(): SendSmtpEmailAttachmentInner[] {
    return this.attachment;
  }

  public addAttachment(attachment: SendSmtpEmailAttachmentInner): this {
    this.attachment.push(attachment);
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

  public async send(): Promise<{
    response: IncomingMessage;
    body: CreateSmtpEmail;
  }> {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.sender = this.sender ?? undefined;
    sendSmtpEmail.to = this.to ?? undefined;
    sendSmtpEmail.bcc = this.bcc ?? undefined;
    sendSmtpEmail.cc = this.cc ?? undefined;
    sendSmtpEmail.htmlContent = this.htmlContent ?? undefined;
    sendSmtpEmail.textContent = this.textContent ?? undefined;
    sendSmtpEmail.subject = this.subject ?? undefined;
    sendSmtpEmail.replyTo = this.replyTo ?? undefined;
    sendSmtpEmail.attachment = this.attachment ?? undefined;
    sendSmtpEmail.headers = this.headers ?? undefined;
    sendSmtpEmail.templateId = this.templateId ?? undefined;
    sendSmtpEmail.params = this.params ?? undefined;
    sendSmtpEmail.messageVersions = this.messageVersions ?? undefined;
    sendSmtpEmail.tags = this.tags ?? undefined;
    sendSmtpEmail.scheduledAt = this.scheduledAt ?? undefined;
    sendSmtpEmail.batchId = this.batchId ?? undefined;

    return await this.client.sendTransacEmail(sendSmtpEmail);
  }
}
