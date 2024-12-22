import type { IHeaderChecker } from './types.ts';

/**
 * The HeaderChecker class is an abstract class that provides methods for checking the content type of HTTP headers.
 */
export abstract class HeaderChecker implements IHeaderChecker {
  private headers: Headers;

  /**
   * Creates a new instance of the class.
   */
  constructor(headers: Headers) {
    this.headers = headers;
  }

  /**
   * Checks if the content type of the response is JSON.
   */
  public isJson(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/(?:ld\+)?json/i.test(contentType);
  }

  /**
   * Checks if the request content type is multipart/form-data.
   */
  public isFormData(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /multipart\/form-data/i.test(contentType);
  }

  /**
   * Checks if the current request is a form submission.
   */
  public isForm(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/x-www-form-urlencoded/i.test(contentType);
  }

  /**
   * Checks if the content type of the response is text-based.
   */
  public isText(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/css|\*|csv|html|plain|xml/i.test(contentType);
  }

  /**
   * Checks if the Content-Type header indicates that the response is a stream.
   */
  public isStream(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /application\/octet-stream/i.test(contentType);
  }

  /**
   * Checks if the file is a blob.
   */
  public isBlob(): boolean {
    return this.isStream();
  }

  /**
   * Checks if the content type of the HTTP response is HTML.
   */
  public isHtml(): boolean {
    const contentType = this.headers.get('Content-Type');

    if (!contentType) {
      return false;
    }

    return /text\/html/i.test(contentType);
  }
}
