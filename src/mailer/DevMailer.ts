import nodemailer, {
  Address,
  Attachment,
  Headers,
} from 'npm:nodemailer@6.9.16';
import { EnvConfig } from '../config/EnvConfig.ts';
import { mailer } from './decorators.ts';
import { MailerException } from './MailerException.ts';
import { IMailer } from './types.ts';

@mailer()
export class DevMailer implements IMailer {
  private sender: Address | null = null;
  private to: Address[] = [];
  private cc: Address[] = [];
  private bcc: Address[] = [];
  private htmlContent: string | null = null;
  private textContent: string | null = null;
  private subject: string | null = null;
  private replyTo: Address[] = [];
  private attachments: Attachment[] = [];
  private headers: Headers | null = null;

  /**
   * Sets the email sender address
   */
  public setSender(sender: Address): this {
    this.sender = sender;

    return this;
  }

  /**
   * Gets the current sender address
   */
  public getSender(): Address | null {
    return this.sender;
  }

  /**
   * Sets multiple destination addresses
   */
  public setDestinations(to: Address[]): this {
    this.to = to;

    return this;
  }

  /**
   * Gets all destination addresses
   */
  public getDestinations(): Address[] {
    return this.to;
  }

  /**
   * Adds a single destination address
   */
  public addDestination(to: Address): this {
    this.to.push(to);

    return this;
  }

  /**
   * Sets multiple CC addresses
   */
  public setCc(cc: Address[]): this {
    this.cc = cc;

    return this;
  }

  /**
   * Gets all CC addresses
   */
  public getCc(): Address[] {
    return this.cc;
  }

  /**
   * Adds a single CC address
   */
  public addCc(cc: Address): this {
    this.cc.push(cc);

    return this;
  }

  /**
   * Sets multiple BCC addresses
   */
  public setBcc(bcc: Address[]): this {
    this.bcc = bcc;

    return this;
  }

  /**
   * Gets all BCC addresses
   */
  public getBcc(): Address[] {
    return this.bcc;
  }

  /**
   * Adds a single BCC address
   */
  public addBcc(bcc: Address): this {
    this.bcc.push(bcc);

    return this;
  }

  /**
   * Sets the HTML content of the email
   */
  public setHtmlContent(content: string): this {
    this.htmlContent = content;
    return this;
  }

  /**
   * Gets the HTML content of the email
   */
  public getHtmlContent(): string | null {
    return this.htmlContent;
  }

  /**
   * Sets the plain text content of the email
   */
  public setTextContent(content: string): this {
    this.textContent = content;
    return this;
  }

  /**
   * Gets the plain text content of the email
   */
  public getTextContent(): string | null {
    return this.textContent;
  }

  /**
   * Sets the email subject
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
   * Sets multiple reply-to addresses
   */
  public setReplyTo(replyTo: Address[]): this {
    this.replyTo = replyTo;
    return this;
  }

  /**
   * Gets all reply-to addresses
   */
  public getReplyTo(): Address[] {
    return this.replyTo;
  }

  /**
   * Adds a single reply-to address
   */
  public addReplyTo(replyTo: Address): this {
    this.replyTo.push(replyTo);
    return this;
  }

  /**
   * Sets multiple email attachments
   */
  public setAttachments(attachments: Attachment[]): this {
    this.attachments = attachments;
    return this;
  }

  /**
   * Gets all email attachments
   */
  public getAttachments(): Attachment[] {
    return this.attachments;
  }

  /**
   * Adds a single email attachment
   */
  public addAttachment(attachment: Attachment): this {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachment);
    return this;
  }

  /**
   * Sets custom email headers
   */
  public setHeaders(headers: object): this {
    this.headers = headers;
    return this;
  }

  /**
   * Gets custom email headers
   */
  public getHeaders(): object | null {
    return this.headers;
  }

  /**
   * Sends the email with the configured settings
   * @throws MailerException if the mailer URL is not set
   */
  public async send<T = void>(): Promise<T> {
    const url = Deno.env.get(EnvConfig.KEYS.mailer.dev.url);

    if (!url) {
      throw new MailerException('Dev mailer url is not set');
    }

    const transporter = nodemailer.createTransport({
      url,
    });

    return await transporter.sendMail({
      from: this.sender ?? undefined,
      to: this.to,
      cc: this.cc,
      bcc: this.bcc,
      subject: this.subject ?? undefined,
      html: this.htmlContent ?? undefined,
      text: this.textContent ?? undefined,
      replyTo: this.replyTo,
      attachments: this.attachments,
      headers: this.headers,
    });
  }
}
