import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import {
  type SendSmtpEmailAttachmentInner,
  type SendSmtpEmailBccInner,
  type SendSmtpEmailCcInner,
  type SendSmtpEmailMessageVersionsInner,
  type SendSmtpEmailReplyTo,
  TransactionalEmailsApi,
} from '@getbrevo/brevo';
import { container } from '../container';
import { BrevoMailer } from './BrevoMailer';

describe('BrevoMailer', () => {
  let mailer: BrevoMailer;

  beforeEach(() => {
    mailer = container.get(BrevoMailer);
  });

  describe('sender methods', () => {
    it('should set and get sender', () => {
      mailer.setSender('test@example.com', 'Test User');
      expect(mailer.getSender()).toEqual({
        email: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  describe('destination methods', () => {
    it('should set and get destinations', () => {
      const destinations = [
        { email: 'test1@example.com', name: 'Test 1' },
        { email: 'test2@example.com', name: 'Test 2' },
      ];
      mailer.setDestinations(destinations);
      expect(mailer.getDestinations()).toEqual(destinations);
    });

    it('should add single destination', () => {
      mailer.setDestinations([]);
      const destination = { email: 'test@example.com', name: 'Test' };
      mailer.addDestination(destination);

      expect(mailer.getDestinations()).toEqual([destination]);
    });
  });

  describe('BCC methods', () => {
    it('should set and get BCC recipients', () => {
      const bcc: SendSmtpEmailBccInner[] = [{ email: 'bcc@example.com' }];
      mailer.setBcc(bcc);
      expect(mailer.getBcc()).toEqual(bcc);
    });

    it('should add single BCC recipient', () => {
      mailer.setBcc([]);
      const bcc: SendSmtpEmailBccInner = { email: 'bcc@example.com' };
      mailer.addBcc(bcc);
      expect(mailer.getBcc()).toEqual([bcc]);
    });
  });

  describe('CC methods', () => {
    it('should set and get CC recipients', () => {
      const cc: SendSmtpEmailCcInner[] = [{ email: 'cc@example.com' }];
      mailer.setCc(cc);
      expect(mailer.getCc()).toEqual(cc);
    });

    it('should add single CC recipient', () => {
      mailer.setCc([]);
      const cc: SendSmtpEmailCcInner = { email: 'cc@example.com' };
      mailer.addCc(cc);
      expect(mailer.getCc()).toEqual([cc]);
    });
  });

  describe('content methods', () => {
    it('should set and get HTML content', () => {
      const html = '<p>Test content</p>';
      mailer.setHtmlContent(html);
      expect(mailer.getHtmlContent()).toBe(html);
    });

    it('should set and get text content', () => {
      const text = 'Test content';
      mailer.setTextContent(text);
      expect(mailer.getTextContent()).toBe(text);
    });
  });

  describe('subject methods', () => {
    it('should set and get subject', () => {
      const subject = 'Test Subject';
      mailer.setSubject(subject);
      expect(mailer.getSubject()).toBe(subject);
    });
  });

  describe('reply-to methods', () => {
    it('should set and get reply-to', () => {
      const replyTo: SendSmtpEmailReplyTo = { email: 'reply@example.com' };
      mailer.setReplyTo(replyTo);
      expect(mailer.getReplyTo()).toEqual(replyTo);
    });
  });

  describe('attachment methods', () => {
    it('should set and get attachments', () => {
      const attachments: SendSmtpEmailAttachmentInner[] = [
        {
          name: 'test.txt',
          content: 'dGVzdA==',
        },
      ];
      mailer.setAttachment(attachments);
      expect(mailer.getAttachments()).toEqual(attachments);
    });

    it('should add single attachment', () => {
      mailer.setAttachment([]);
      const attachment: SendSmtpEmailAttachmentInner = {
        name: 'test.txt',
        content: 'dGVzdA==',
      };
      mailer.addAttachment(attachment);
      expect(mailer.getAttachments()).toEqual([attachment]);
    });
  });

  describe('headers methods', () => {
    it('should set and get headers', () => {
      const headers = { 'X-Custom': 'value' };
      mailer.setHeaders(headers);
      expect(mailer.getHeaders()).toEqual(headers);
    });
  });

  describe('template methods', () => {
    it('should set and get template ID', () => {
      const templateId = 123;
      mailer.setTemplateId(templateId);
      expect(mailer.getTemplateId()).toBe(templateId);
    });
  });

  describe('params methods', () => {
    it('should set and get params', () => {
      const params = { key: 'value' };
      mailer.setParams(params);
      expect(mailer.getParams()).toEqual(params);
    });
  });

  describe('message versions methods', () => {
    it('should set and get message versions', () => {
      const versions: SendSmtpEmailMessageVersionsInner[] = [
        {
          to: [{ email: 'test@example.com' }],
          subject: 'Test',
        },
      ];
      mailer.setMessageVersions(versions);
      expect(mailer.getMessageVersions()).toEqual(versions);
    });

    it('should add single message version', () => {
      mailer.setMessageVersions([]);
      const version: SendSmtpEmailMessageVersionsInner = {
        to: [{ email: 'test@example.com' }],
        subject: 'Test',
      };
      mailer.addMessageVersion(version);
      expect(mailer.getMessageVersions()).toEqual([version]);
    });
  });

  describe('tags methods', () => {
    it('should set and get tags', () => {
      const tags = ['tag1', 'tag2'];
      mailer.setTags(tags);
      expect(mailer.getTags()).toEqual(tags);
    });

    it('should add single tag', () => {
      mailer.setTags([]);
      const tag = 'test-tag';
      mailer.addTag(tag);
      expect(mailer.getTags()).toEqual([tag]);
    });
  });

  describe('scheduled at methods', () => {
    it('should set and get scheduled at', () => {
      const date = new Date();
      mailer.setScheduledAt(date);
      expect(mailer.getScheduledAt()).toEqual(date);
    });
  });

  describe('batch ID methods', () => {
    it('should set and get batch ID', () => {
      const batchId = 'batch-123';
      mailer.setBatchId(batchId);
      expect(mailer.getBatchId()).toBe(batchId);
    });
  });

  describe('send method', () => {
    it('should successfully send email when properly configured', async () => {
      process.env.BREVO_API_KEY = 'test-key';

      const spy = spyOn(
        TransactionalEmailsApi.prototype,
        'sendTransacEmail',
      ).mockResolvedValue({
        // @ts-ignore
        response: {},
        body: { messageId: 'test-id' },
      });
      expect(spy).toHaveBeenCalledTimes(0);
      await mailer.send();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
