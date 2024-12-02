/**
 * Mailer module providing email sending functionality with support for multiple mail providers.
 * Includes support for HTML content, attachments, CC/BCC recipients, and more.
 *
 * @module mailer
 *
 * @example
 * ```ts
 * import { BrevoMailer } from 'eagle';
 *
 * // Create a new mailer instance
 * const mailer = new BrevoMailer();
 *
 * // Send a basic email
 * await mailer
 *   .from({ email: 'sender@example.com', name: 'Sender Name' })
 *   .to([{ email: 'recipient@example.com' }])
 *   .subject('Hello')
 *   .html('<h1>Hello World!</h1>')
 *   .send();
 * ```
 *
 * @example
 * ```ts
 * // Send email with CC, BCC and attachments
 * await mailer
 *   .from({ email: 'sender@example.com' })
 *   .to([{ email: 'recipient@example.com' }])
 *   .cc([{ email: 'cc@example.com' }])
 *   .bcc([{ email: 'bcc@example.com' }])
 *   .subject('Document Attached')
 *   .html('<p>Please find the document attached.</p>')
 *   .attachFile({
 *     name: 'document.pdf',
 *     content: 'base64_encoded_content'
 *   })
 *   .send();
 * ```
 *
 * @example
 * ```ts
 * // Using development mailer for testing
 * import { DevMailer } from 'eagle';
 *
 * const devMailer = new DevMailer();
 * await devMailer
 *   .from({ email: 'test@example.com' })
 *   .to([{ email: 'dev@example.com' }])
 *   .subject('Test Email')
 *   .text('This is a test email')
 *   .send();
 * ```
 *
 * @example
 * ```ts
 * // Using both HTML and plain text content
 * await mailer
 *   .from({ email: 'sender@example.com' })
 *   .to([{ email: 'recipient@example.com' }])
 *   .subject('Multipart Email')
 *   .html('<h1>Hello</h1><p>This is HTML content</p>')
 *   .text('Hello\n\nThis is plain text content')
 *   .send();
 * ```
 */

export { BrevoMailer } from './BrevoMailer.ts';
export * from './decorators.ts';
export { DevMailer } from './DevMailer.ts';
export { MailerDecoratorException } from './MailerDecoratorException.ts';
export { MailerException } from './MailerException.ts';
export * from './types.ts';
