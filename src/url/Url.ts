import { ReadonlyCollection } from '../collection/ReadonlyCollection';
import type { IReadonlyCollection } from '../collection/types';
import { parseString, trim } from '../helper';
import type { ScalarType } from '../types';
import type { IUrl } from './types';

export class Url implements IUrl {
  public readonly native: URL;
  public readonly protocol: string;
  public readonly subdomain: string | null;
  public readonly domain: string;
  public readonly port: number;
  public readonly path: string;
  public readonly queries: IReadonlyCollection<string, ScalarType>;
  public readonly fragment: string;
  public readonly base: string;
  public readonly origin: string;

  constructor(url: string | URL) {
    this.native = new URL(url);

    this.protocol = trim(this.native.protocol, ':');
    this.subdomain = null;
    this.domain = this.native.hostname;
    const match = /(?<subdomain>.+)\.(?<domain>[a-z0-9-_]+\.[a-z0-9]+)$/i.exec(
      this.domain,
    );
    if (match) {
      const { subdomain, domain } = match.groups as {
        subdomain: string;
        domain: string;
      };
      this.subdomain = subdomain;
      this.domain = domain;
    }

    this.port = this.native.port ? parseString(this.native.port) : 80;
    this.path = `/${trim(this.native.pathname, '/')}`;
    this.fragment = trim(this.native.hash, '#');
    this.base = `${this.native.protocol}//${this.native.host}`;
    this.origin = this.native.origin;

    const parameters: [string, ScalarType][] = [];
    for (const [key, value] of this.native.searchParams) {
      parameters.push([key, parseString<ScalarType>(value)]);
    }
    this.queries = new ReadonlyCollection<string, ScalarType>(parameters);
  }
}
