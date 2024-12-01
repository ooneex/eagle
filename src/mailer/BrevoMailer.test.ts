import { BrevoMailer, MailerException } from '@/mailer/mod.ts';
import { expect } from '@std/expect';
import { afterEach, beforeEach, describe, it } from '@std/testing/bdd';
import { assertSpyCalls, stub } from '@std/testing/mock';
import { TransactionalEmailsApi } from 'npm:@getbrevo/brevo';

describe('BrevoMailerAdapterService', () => {
  let service: BrevoMailer;

  beforeEach(() => {
    Deno.env.set('BREVO_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    Deno.env.delete('BREVO_API_KEY');
  });

  it('should initialize with API key', () => {
    service = new BrevoMailer();
    expect(service.getSender()).toBe(null);
    expect(service.getTo()).toEqual([]);
  });

  it('should throw MailerException when API key is not set', () => {
    Deno.env.delete('BREVO_API_KEY');
    expect(() => new BrevoMailer()).toThrow(
      MailerException,
    );
  });

  it('should set and get sender', () => {
    service = new BrevoMailer();
    const sender = { email: 'test@example.com', name: 'Test Sender' };
    service.setSender(sender.email, sender.name);
    expect(service.getSender()).toEqual(sender);
  });

  it('should set and get recipients', () => {
    service = new BrevoMailer();
    const recipient = {
      email: 'recipient@example.com',
      name: 'Test Recipient',
    };
    service.addTo(recipient);
    expect(service.getTo()).toEqual([recipient]);
  });

  it('should send email successfully', async () => {
    service = new BrevoMailer();

    // Mock the sendTransacEmail method
    const mockResponse = {
      response: {} as any,
      body: {} as any,
    };

    const sendTransacEmailSpy = stub(
      TransactionalEmailsApi.prototype,
      'sendTransacEmail',
      () => Promise.resolve(mockResponse),
    );

    // Setup email data
    service
      .setSender('sender@example.com', 'Sender')
      .addTo({ email: 'recipient@example.com', name: 'Recipient' })
      .setSubject('Test Subject')
      .setHtmlContent('<p>Test content</p>');

    const result = await service.send();

    // Verify the email was sent with correct data
    assertSpyCalls(sendTransacEmailSpy, 1);
    expect(result).toEqual(mockResponse);
  });

  it('should set and get text content', () => {
    service = new BrevoMailer();
    const content = 'Test text content';
    service.setTextContent(content);
    expect(service.getTextContent()).toBe(content);
  });

  it('should set and get reply to', () => {
    service = new BrevoMailer();
    const replyTo = { email: 'reply@example.com', name: 'Reply Contact' };
    service.setReplyTo(replyTo);
    expect(service.getReplyTo()).toEqual(replyTo);
  });

  it('should set and get attachments', () => {
    service = new BrevoMailer();
    const attachment = { name: 'test.txt', content: 'SGVsbG8gd29ybGQ=' };
    service.addAttachment(attachment);
    expect(service.getAttachment()).toEqual([attachment]);
  });

  it('should set and get headers', () => {
    service = new BrevoMailer();
    const headers = { 'X-Custom': 'value' };
    service.setHeaders(headers);
    expect(service.getHeaders()).toEqual(headers);
  });

  it('should set and get template id', () => {
    service = new BrevoMailer();
    const templateId = 123;
    service.setTemplateId(templateId);
    expect(service.getTemplateId()).toBe(templateId);
  });

  it('should set and get params', () => {
    service = new BrevoMailer();
    const params = { key: 'value' };
    service.setParams(params);
    expect(service.getParams()).toEqual(params);
  });

  it('should set and get message versions', () => {
    service = new BrevoMailer();
    const version = { to: [{ email: 'test@example.com', name: 'Test' }] };
    service.addMessageVersion(version);
    expect(service.getMessageVersions()).toEqual([version]);
  });

  it('should set and get tags', () => {
    service = new BrevoMailer();
    const tags = ['tag1', 'tag2'];
    service.setTags(tags);
    expect(service.getTags()).toEqual(tags);
  });
});
