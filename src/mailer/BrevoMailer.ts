import {
  SendSmtpEmail,
  SendSmtpEmailAttachmentInner,
  SendSmtpEmailBccInner,
  SendSmtpEmailCcInner,
  SendSmtpEmailMessageVersionsInner,
  SendSmtpEmailReplyTo,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from 'npm:@getbrevo/brevo';
import { EnvConfig } from '../config/EnvConfig.ts';
import { mailer } from './decorators.ts';
import { MailerException } from './MailerException.ts';
import {
  BrevoMailerResponseType,
  DestinationType,
  IMailer,
  SenderType,
} from './types.ts';

/**
 * BrevoMailer class for sending transactional emails via Brevo's SMTP service
 */
@mailer()
export class BrevoMailer implements IMailer {
  /** The sender's email and optional name */
  private sender: SenderType | null = null;

  /** Array of email recipients */
  private to: DestinationType[] = [];

  /** Array of CC recipients */
  private cc: SendSmtpEmailCcInner[] = [];

  /** Array of BCC recipients */
  private bcc: SendSmtpEmailBccInner[] = [];

  /** HTML content of the email */
  private htmlContent: string | null = null;

  /** Plain text content of the email */
  private textContent: string | null = null;

  /** Email subject line */
  private subject: string | null = null;

  /** Reply-to email address */
  private replyTo: SendSmtpEmailReplyTo | null = null;

  /** Array of email attachments */
  private attachments: SendSmtpEmailAttachmentInner[] = [];

  /** Custom email headers */
  private headers: object | null = null;

  /** ID of email template to use */
  private templateId: number | null = null;

  /** Template parameters */
  private params: object | null = null;

  /** Array of message versions */
  private messageVersions: SendSmtpEmailMessageVersionsInner[] = [];

  /** Array of tags */
  private tags: string[] = [];

  /** Scheduled send date/time */
  private scheduledAt: Date | null = null;

  /** Batch ID for grouping emails */
  private batchId: string | null = null;

  /**
   * Sets the email sender
   * @param email - Sender's email address
   * @param name - Optional sender name
   */
  public setSender(email: string, name?: string): this {
    this.sender = { email, name };

    return this;
  }

  /**
   * Gets the current sender
   */
  public getSender(): SenderType | null {
    return this.sender;
  }

  /**
   * Sets multiple email recipients
   * @param to - Array of recipients
   */
  public setDestinations(to: DestinationType[]): this {
    this.to = to;

    return this;
  }

  /**
   * Gets the current recipients
   */
  public getDestinations(): DestinationType[] {
    return this.to;
  }

  /**
   * Adds a single recipient
   * @param to - Recipient to add
   */
  public addDestination(to: DestinationType): this {
    this.to.push(to);

    return this;
  }

  /**
   * Sets BCC recipients
   * @param bcc - Array of BCC recipients
   */
  public setBcc(bcc: SendSmtpEmailBccInner[]): this {
    this.bcc = bcc;
    return this;
  }

  /**
   * Gets BCC recipients
   */
  public getBcc(): SendSmtpEmailBccInner[] {
    return this.bcc;
  }

  /**
   * Adds a single BCC recipient
   * @param bcc - BCC recipient to add
   */
  public addBcc(bcc: SendSmtpEmailBccInner): this {
    this.bcc.push(bcc);
    return this;
  }

  /**
   * Sets CC recipients
   * @param cc - Array of CC recipients
   */
  public setCc(cc: SendSmtpEmailCcInner[]): this {
    this.cc = cc;
    return this;
  }

  /**
   * Gets CC recipients
   */
  public getCc(): SendSmtpEmailCcInner[] {
    return this.cc;
  }

  /**
   * Adds a single CC recipient
   * @param cc - CC recipient to add
   */
  public addCc(cc: SendSmtpEmailCcInner): this {
    this.cc.push(cc);
    return this;
  }

  /**
   * Sets the HTML content
   * @param content - HTML content string
   */
  public setHtmlContent(content: string): this {
    this.htmlContent = content;
    return this;
  }

  /**
   * Gets the HTML content
   */
  public getHtmlContent(): string | null {
    return this.htmlContent;
  }

  /**
   * Sets the plain text content
   * @param content - Text content string
   */
  public setTextContent(content: string): this {
    this.textContent = content;
    return this;
  }

  /**
   * Gets the text content
   */
  public getTextContent(): string | null {
    return this.textContent;
  }

  /**
   * Sets the email subject
   * @param subject - Subject line
   */
  public setSubject(subject: string): this {
    this.subject = subject;
    return this;
  }

  /**
   * Gets the email subject
   */
  public getSubject(): string | null {
    return this.subject;
  }

  /**
   * Sets the reply-to address
   * @param replyTo - Reply-to email details
   */
  public setReplyTo(replyTo: SendSmtpEmailReplyTo): this {
    this.replyTo = replyTo;
    return this;
  }

  /**
   * Gets the reply-to address
   */
  public getReplyTo(): SendSmtpEmailReplyTo | null {
    return this.replyTo;
  }

  /**
   * Sets email attachments
   * @param attachment - Array of attachments
   */
  public setAttachment(attachment: SendSmtpEmailAttachmentInner[]): this {
    this.attachments = attachment;
    return this;
  }

  /**
   * Gets email attachments
   */
  public getAttachments(): SendSmtpEmailAttachmentInner[] {
    return this.attachments;
  }

  /**
   * Adds a single attachment
   * @param attachment - Attachment to add
   */
  public addAttachment(attachment: SendSmtpEmailAttachmentInner): this {
    this.attachments.push(attachment);
    return this;
  }

  /**
   * Sets custom headers
   * @param headers - Headers object
   */
  public setHeaders(headers: object): this {
    this.headers = headers;
    return this;
  }

  /**
   * Gets custom headers
   */
  public getHeaders(): object | null {
    return this.headers;
  }

  /**
   * Sets the template ID
   * @param templateId - Template ID number
   */
  public setTemplateId(templateId: number): this {
    this.templateId = templateId;
    return this;
  }

  /**
   * Gets the template ID
   */
  public getTemplateId(): number | null {
    return this.templateId;
  }

  /**
   * Sets template parameters
   * @param params - Parameters object
   */
  public setParams(params: object): this {
    this.params = params;
    return this;
  }

  /**
   * Gets template parameters
   */
  public getParams(): object | null {
    return this.params;
  }

  /**
   * Sets message versions
   * @param versions - Array of message versions
   */
  public setMessageVersions(
    versions: SendSmtpEmailMessageVersionsInner[],
  ): this {
    this.messageVersions = versions;
    return this;
  }

  /**
   * Gets message versions
   */
  public getMessageVersions(): SendSmtpEmailMessageVersionsInner[] {
    return this.messageVersions;
  }

  /**
   * Adds a single message version
   * @param version - Message version to add
   */
  public addMessageVersion(version: SendSmtpEmailMessageVersionsInner): this {
    this.messageVersions.push(version);
    return this;
  }

  /**
   * Sets email tags
   * @param tags - Array of tag strings
   */
  public setTags(tags: string[]): this {
    this.tags = tags;
    return this;
  }

  /**
   * Gets email tags
   */
  public getTags(): string[] {
    return this.tags;
  }

  /**
   * Adds a single tag
   * @param tag - Tag to add
   */
  public addTag(tag: string): this {
    this.tags.push(tag);
    return this;
  }

  /**
   * Sets scheduled send time
   * @param date - Scheduled date/time
   */
  public setScheduledAt(date: Date): this {
    this.scheduledAt = date;
    return this;
  }

  /**
   * Gets scheduled send time
   */
  public getScheduledAt(): Date | null {
    return this.scheduledAt;
  }

  /**
   * Sets batch ID
   * @param id - Batch ID string
   */
  public setBatchId(id: string): this {
    this.batchId = id;
    return this;
  }

  /**
   * Gets batch ID
   */
  public getBatchId(): string | null {
    return this.batchId;
  }

  /**
   * Sends the email using Brevo's SMTP API
   * @throws MailerException if Brevo credentials are not set
   */
  public async send<T = BrevoMailerResponseType>(): Promise<T> {
    const key = Deno.env.get(EnvConfig.KEYS.mailer.brevo.key);

    if (!key) {
      throw new MailerException('Brevo mailer credentials are not set');
    }

    const client = new TransactionalEmailsApi();

    client.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      key,
    );

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

    return await client.sendTransacEmail(sendSmtpEmail) as T;
  }
}
