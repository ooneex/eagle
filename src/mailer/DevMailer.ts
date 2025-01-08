import nodemailer from 'nodemailer';
import type { Address, Attachment, Headers } from 'nodemailer/lib/mailer';
import { MailerException } from './MailerException.ts';
import { mailer } from './decorators.ts';
import type { IMailer } from './types.ts';

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
  private headers?: Headers;

  public setSender(sender: Address): this {
    this.sender = sender;

    return this;
  }

  public getSender(): Address | null {
    return this.sender;
  }

  public setDestinations(to: Address[]): this {
    this.to = to;

    return this;
  }

  public getDestinations(): Address[] {
    return this.to;
  }

  public addDestination(to: Address): this {
    this.to.push(to);

    return this;
  }

  public setCc(cc: Address[]): this {
    this.cc = cc;

    return this;
  }

  public getCc(): Address[] {
    return this.cc;
  }

  public addCc(cc: Address): this {
    this.cc.push(cc);

    return this;
  }

  public setBcc(bcc: Address[]): this {
    this.bcc = bcc;

    return this;
  }

  public getBcc(): Address[] {
    return this.bcc;
  }

  public addBcc(bcc: Address): this {
    this.bcc.push(bcc);

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

  public setReplyTo(replyTo: Address[]): this {
    this.replyTo = replyTo;
    return this;
  }

  public getReplyTo(): Address[] {
    return this.replyTo;
  }

  public addReplyTo(replyTo: Address): this {
    this.replyTo.push(replyTo);
    return this;
  }

  public setAttachments(attachments: Attachment[]): this {
    this.attachments = attachments;
    return this;
  }

  public getAttachments(): Attachment[] {
    return this.attachments;
  }

  public addAttachment(attachment: Attachment): this {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachment);
    return this;
  }

  public setHeaders(headers: Headers): this {
    this.headers = headers;
    return this;
  }

  public getHeaders(): Headers | undefined {
    return this.headers;
  }

  public async send<T = void>(url?: string): Promise<T> {
    url = url ?? process.env.DEV_MAILER_URL;

    if (!url) {
      throw new MailerException('Dev mailer url is not set');
    }

    const transporter = nodemailer.createTransport({
      url,
    });

    return (await transporter.sendMail({
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
    })) as T;
  }
}
