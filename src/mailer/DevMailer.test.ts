import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { container } from '@/container';
import { DevMailer } from '@/mailer';
import nodemailer from 'nodemailer';

describe('DevMailer', () => {
  let mailer: DevMailer;

  beforeEach(() => {
    mailer = container.get(DevMailer);
  });

  describe('sender methods', () => {
    it('should set and get sender', () => {
      mailer.setSender({ address: 'test@example.com', name: 'Test User' });
      expect(mailer.getSender()).toEqual({
        address: 'test@example.com',
        name: 'Test User',
      });
    });
  });

  describe('destination methods', () => {
    it('should set and get destinations', () => {
      const destinations = [
        { address: 'test1@example.com', name: 'Test 1' },
        { address: 'test2@example.com', name: 'Test 2' },
      ];
      mailer.setDestinations(destinations);
      expect(mailer.getDestinations()).toEqual(destinations);
    });

    it('should add single destination', () => {
      mailer.setDestinations([]);
      const destination = { address: 'test@example.com', name: 'Test' };
      mailer.addDestination(destination);
      expect(mailer.getDestinations()).toEqual([destination]);
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

  describe('send method', () => {
    it('should successfully send email and return true', async () => {
      process.env.DEV_MAILER_URL = 'test-url';
      const spy = spyOn(nodemailer, 'createTransport').mockReturnValue({
        sendMail: () => Promise.resolve({ messageId: 'test-id' }),
      } as any);

      expect(spy).toHaveBeenCalledTimes(0);
      await mailer.send();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('CC methods', () => {
    it('should set and get CC recipients', () => {
      const cc = [{ address: 'cc@example.com', name: 'CC User' }];
      mailer.setCc(cc);
      expect(mailer.getCc()).toEqual(cc);
    });

    it('should add single CC recipient', () => {
      mailer.setCc([]);
      const cc = { address: 'cc@example.com', name: 'CC User' };
      mailer.addCc(cc);
      expect(mailer.getCc()).toEqual([cc]);
    });
  });

  describe('BCC methods', () => {
    it('should set and get BCC recipients', () => {
      const bcc = [{ address: 'bcc@example.com', name: 'BCC User' }];
      mailer.setBcc(bcc);
      expect(mailer.getBcc()).toEqual(bcc);
    });

    it('should add single BCC recipient', () => {
      mailer.setBcc([]);
      const bcc = { address: 'bcc@example.com', name: 'BCC User' };
      mailer.addBcc(bcc);
      expect(mailer.getBcc()).toEqual([bcc]);
    });
  });

  describe('reply to methods', () => {
    it('should set and get reply to addresses', () => {
      const replyTo = [{ address: 'reply@example.com', name: 'Reply User' }];
      mailer.setReplyTo(replyTo);
      expect(mailer.getReplyTo()).toEqual(replyTo);
    });

    it('should add single reply to address', () => {
      mailer.setReplyTo([]);
      const replyTo = { address: 'reply@example.com', name: 'Reply User' };
      mailer.addReplyTo(replyTo);
      expect(mailer.getReplyTo()).toEqual([replyTo]);
    });
  });

  describe('attachment methods', () => {
    it('should set and get attachments', () => {
      const attachments = [{ filename: 'test.txt', content: 'test content' }];
      mailer.setAttachments(attachments);
      expect(mailer.getAttachments()).toEqual(attachments);
    });

    it('should add single attachment', () => {
      mailer.setAttachments([]);
      const attachment = { filename: 'test.txt', content: 'test content' };
      mailer.addAttachment(attachment);
      expect(mailer.getAttachments()).toEqual([attachment]);
    });
  });

  describe('headers methods', () => {
    it('should set and get headers', () => {
      const headers = { 'X-Custom': 'test' };
      mailer.setHeaders(headers);
      expect(mailer.getHeaders()).toEqual(headers);
    });
  });
});
