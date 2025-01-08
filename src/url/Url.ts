import { ReadonlyCollection } from '@/collection/ReadonlyCollection.ts';
import type { IReadonlyCollection } from '@/collection/types.ts';
import { parseString, trim } from '@/helper';
import type { ScalarType } from '@/types.ts';
import type { IUrl } from './types.ts';

/**
 * Represents a URL with parsed components.
 * Provides access to various parts of a URL including protocol, domain, subdomain,
 * port, path, query parameters, and fragment.
 */
export class Url implements IUrl {
  /** The native URL object */
  public readonly native: URL;
  /** The URL protocol (e.g. 'http', 'https') */
  public readonly protocol: string;
  /** The subdomain if present, null otherwise */
  public readonly subdomain: string | null;
  /** The domain name */
  public readonly domain: string;
  /** The port number, defaults to 80 if not specified */
  public readonly port: number;
  /** The URL path */
  public readonly path: string;
  /** Collection of query parameters */
  public readonly queries: IReadonlyCollection<string, ScalarType>;
  /** The URL fragment (hash) */
  public readonly fragment: string;
  /** The base URL (protocol + host) */
  public readonly base: string;
  /** The URL origin */
  public readonly origin: string;

  /**
   * Creates a new Url instance
   * @param url - URL string or URL object to parse
   */
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
