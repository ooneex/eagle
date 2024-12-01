import { EnvConfig } from '@/config/mod.ts';
import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { BrevoMailer } from './mod.ts';

describe('BrevoMailer', () => {
  let mailer: BrevoMailer;

  beforeEach(() => {
    mailer = new BrevoMailer();
  });

  describe('sender operations', () => {
    it('should set and get sender correctly', () => {
      const email = 'test@example.com';
      const name = 'Test Sender';

      mailer.setSender(email, name);

      expect(mailer.getSender()).toEqual({ email, name });
    });
  });

  describe('recipient operations', () => {
    it('should add and get recipients correctly', () => {
      const recipient1 = {
        email: 'recipient1@example.com',
        name: 'Recipient 1',
      };
      const recipient2 = {
        email: 'recipient2@example.com',
        name: 'Recipient 2',
      };

      mailer.addDestination(recipient1);
      mailer.addDestination(recipient2);

      expect(mailer.getDestinations()).toEqual([recipient1, recipient2]);
    });

    it('should set recipients array directly', () => {
      const recipients = [
        { email: 'recipient1@example.com', name: 'Recipient 1' },
        { email: 'recipient2@example.com', name: 'Recipient 2' },
      ];

      mailer.setDestinations(recipients);

      expect(mailer.getDestinations()).toEqual(recipients);
    });
  });

  describe('email content', () => {
    it('should set and get subject correctly', () => {
      const subject = 'Test Subject';

      mailer.setSubject(subject);

      expect(mailer.getSubject()).toBe(subject);
    });

    it('should set and get HTML content correctly', () => {
      const content = '<h1>Hello World</h1>';

      mailer.setHtmlContent(content);

      expect(mailer.getHtmlContent()).toBe(content);
    });
  });

  describe('send operation', () => {
    it('should throw error when API key is not set', async () => {
      Deno.env.delete(EnvConfig.KEYS.mailer.brevo.key);

      await expect(mailer.send()).rejects.toThrow(
        'Brevo mailer credentials are not set',
      );
    });
  });

  describe('BCC operations', () => {
    it('should add and get BCC recipients', () => {
      const bcc1 = {
        email: 'bcc1@example.com',
        name: 'BCC 1',
      };
      const bcc2 = {
        email: 'bcc2@example.com',
        name: 'BCC 2',
      };

      mailer.addBcc(bcc1);
      mailer.addBcc(bcc2);

      expect(mailer.getBcc()).toEqual([bcc1, bcc2]);
    });

    it('should set BCC recipients array directly', () => {
      const bccList = [
        { email: 'bcc1@example.com', name: 'BCC 1' },
        { email: 'bcc2@example.com', name: 'BCC 2' },
      ];

      mailer.setBcc(bccList);

      expect(mailer.getBcc()).toEqual(bccList);
    });
  });

  describe('CC operations', () => {
    it('should add and get CC recipients', () => {
      const cc1 = {
        email: 'cc1@example.com',
        name: 'CC 1',
      };
      const cc2 = {
        email: 'cc2@example.com',
        name: 'CC 2',
      };

      mailer.addCc(cc1);
      mailer.addCc(cc2);

      expect(mailer.getCc()).toEqual([cc1, cc2]);
    });

    it('should set CC recipients array directly', () => {
      const ccList = [
        { email: 'cc1@example.com', name: 'CC 1' },
        { email: 'cc2@example.com', name: 'CC 2' },
      ];

      mailer.setCc(ccList);

      expect(mailer.getCc()).toEqual(ccList);
    });
  });

  describe('text content operations', () => {
    it('should set and get text content', () => {
      const content = 'Hello World in plain text';

      mailer.setTextContent(content);

      expect(mailer.getTextContent()).toBe(content);
    });
  });

  describe('reply to operations', () => {
    it('should set and get reply to', () => {
      const replyTo = {
        email: 'reply@example.com',
        name: 'Reply Handler',
      };

      mailer.setReplyTo(replyTo);

      expect(mailer.getReplyTo()).toEqual(replyTo);
    });
  });

  describe('attachment operations', () => {
    it('should add and get attachments', () => {
      const attachment1 = { name: 'test1.pdf', content: 'base64content1' };
      const attachment2 = { name: 'test2.pdf', content: 'base64content2' };

      mailer.addAttachment(attachment1);
      mailer.addAttachment(attachment2);

      expect(mailer.getAttachments()).toEqual([attachment1, attachment2]);
    });

    it('should set attachments array directly', () => {
      const attachments = [
        { name: 'test1.pdf', content: 'base64content1' },
        { name: 'test2.pdf', content: 'base64content2' },
      ];

      mailer.setAttachment(attachments);

      expect(mailer.getAttachments()).toEqual(attachments);
    });
  });

  describe('headers operations', () => {
    it('should set and get headers', () => {
      const headers = { 'X-Custom': 'value' };

      mailer.setHeaders(headers);

      expect(mailer.getHeaders()).toEqual(headers);
    });
  });

  describe('template operations', () => {
    it('should set and get template ID', () => {
      const templateId = 123;

      mailer.setTemplateId(templateId);

      expect(mailer.getTemplateId()).toBe(templateId);
    });
  });

  describe('params operations', () => {
    it('should set and get params', () => {
      const params = { key: 'value' };

      mailer.setParams(params);

      expect(mailer.getParams()).toEqual(params);
    });
  });

  describe('message versions operations', () => {
    it('should add and get message versions', () => {
      const version1 = { to: [{ email: 'test1@example.com' }] };
      const version2 = { to: [{ email: 'test2@example.com' }] };

      mailer.addMessageVersion(version1);
      mailer.addMessageVersion(version2);

      expect(mailer.getMessageVersions()).toEqual([version1, version2]);
    });

    it('should set message versions array directly', () => {
      const versions = [
        { to: [{ email: 'test1@example.com' }] },
        { to: [{ email: 'test2@example.com' }] },
      ];

      mailer.setMessageVersions(versions);

      expect(mailer.getMessageVersions()).toEqual(versions);
    });
  });

  describe('tags operations', () => {
    it('should add and get tags', () => {
      mailer.addTag('tag1');
      mailer.addTag('tag2');

      expect(mailer.getTags()).toEqual(['tag1', 'tag2']);
    });

    it('should set tags array directly', () => {
      const tags = ['tag1', 'tag2'];

      mailer.setTags(tags);

      expect(mailer.getTags()).toEqual(tags);
    });
  });

  describe('scheduling operations', () => {
    it('should set and get scheduled date', () => {
      const date = new Date();

      mailer.setScheduledAt(date);

      expect(mailer.getScheduledAt()).toEqual(date);
    });
  });

  describe('batch operations', () => {
    it('should set and get batch ID', () => {
      const batchId = 'batch123';

      mailer.setBatchId(batchId);

      expect(mailer.getBatchId()).toBe(batchId);
    });
  });
});
