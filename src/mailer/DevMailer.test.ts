import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { DevMailer, MailerException } from './mod.ts';

describe('DevMailer', () => {
  it('should set and get sender address', () => {
    const mailer = new DevMailer();
    const sender = { name: 'Test Sender', address: 'sender@test.com' };

    mailer.setSender(sender);
    expect(mailer.getSender()).toEqual(sender);
  });

  it('should manage destinations (to addresses)', () => {
    const mailer = new DevMailer();
    const destination = { address: 'recipient@test.com' };

    mailer.addDestination(destination);
    expect(mailer.getDestinations()).toEqual([destination]);

    const destinations = [
      { address: 'recipient1@test.com' },
      { address: 'recipient2@test.com' },
    ];
    mailer.setDestinations(destinations);
    expect(mailer.getDestinations()).toEqual(destinations);
  });

  it('should set and get email content', () => {
    const mailer = new DevMailer();
    const htmlContent = '<p>Test HTML</p>';
    const textContent = 'Test text';

    mailer.setHtmlContent(htmlContent);
    mailer.setTextContent(textContent);

    expect(mailer.getHtmlContent()).toBe(htmlContent);
    expect(mailer.getTextContent()).toBe(textContent);
  });

  it('should handle attachments', () => {
    const mailer = new DevMailer();
    const attachment = {
      filename: 'test.txt',
      content: 'Hello World',
    };

    mailer.addAttachment(attachment);
    expect(mailer.getAttachments()).toEqual([attachment]);
  });

  it('should throw error when sending without mailer URL', async () => {
    const mailer = new DevMailer();

    await expect(mailer.send()).rejects.toThrow(MailerException);
  });
});
