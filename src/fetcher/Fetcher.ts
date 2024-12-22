import { Header } from './header/Header.ts';
import { type FetcherMethodType } from './types.ts';

export class Fetcher {
  private method: FetcherMethodType = 'GET';
  private controller = new AbortController();
  public readonly header = new Header();
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  public abort(): void {
    this.controller.abort();
  }

  public head(): Promise<Response> {
    this.method = 'HEAD';
    return this.send();
  }

  public options(): Promise<Response> {
    this.method = 'OPTIONS';
    return this.send();
  }

  public trace(): Promise<Response> {
    this.method = 'TRACE';
    return this.send();
  }

  public delete(): Promise<Response> {
    this.method = 'DELETE';
    return this.send();
  }

  public get(): Promise<Response> {
    this.method = 'GET';
    return this.send();
  }

  public formData(body: FormData): Promise<Response> {
    this.method = 'POST';
    this.header.delete('Content-Type');
    this.header.contentType('multipart/form-data');
    return this.send(body);
  }

  public put(body: Record<string, any> = {}): Promise<Response> {
    this.method = 'PUT';
    this.header.delete('Content-Type');
    this.header.contentType('application/json');
    return this.send(JSON.stringify(body));
  }

  public post(body: Record<string, any> = {}): Promise<Response> {
    this.method = 'POST';
    this.header.delete('Content-Type');
    this.header.contentType('application/json');
    return this.send(JSON.stringify(body));
  }

  public patch(body: Record<string, any> = {}): Promise<Response> {
    this.method = 'PATCH';
    this.header.delete('Content-Type');
    this.header.contentType('application/json');
    return this.send(JSON.stringify(body));
  }

  private send(body?: BodyInit): Promise<Response> {
    this.header.add('X-Requested-With', 'XMLHttpRequest');

    return fetch(this.path, {
      method: this.method,
      headers: this.header.native,
      body,
      signal: this.controller.signal,
    });
  }
}
