import type { IHeaderChecker } from './types.ts';

/**
 * Abstract class for checking HTTP headers content types
 */
export abstract class HeaderChecker implements IHeaderChecker {
  private headers: Headers;

  /**
   * @param headers - The Headers object to check
   */
  constructor(headers: Headers) {
    this.headers = headers;
  }

  /**
   * Checks if content type is JSON
   * @returns boolean indicating if content is JSON
   */
  public isJson(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/(?:ld\+)?json/i.test(contentType);
  }

  /**
   * Checks if content type is multipart form data
   * @returns boolean indicating if content is form data
   */
  public isFormData(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /multipart\/form-data/i.test(contentType);
  }

  /**
   * Checks if content type is URL encoded form
   * @returns boolean indicating if content is form encoded
   */
  public isForm(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/x-www-form-urlencoded/i.test(contentType);
  }

  /**
   * Checks if content type is text-based
   * @returns boolean indicating if content is text
   */
  public isText(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/css|\*|csv|html|plain|xml/i.test(contentType);
  }

  /**
   * Checks if content type is octet stream
   * @returns boolean indicating if content is stream
   */
  public isStream(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/octet-stream/i.test(contentType);
  }

  /**
   * Alias for isStream()
   * @returns boolean indicating if content is blob
   */
  public isBlob(): boolean {
    return this.isStream();
  }

  /**
   * Checks if content type is HTML
   * @returns boolean indicating if content is HTML
   */
  public isHtml(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/html/i.test(contentType);
  }
}
