import type { IReadonlyCollection } from '@/collection/types.ts';
import type { ScalarType } from '@/types.ts';

/**
 * Interface representing a structured URL with its components.
 */
export interface IUrl {
  /** The URL protocol (e.g. 'http:', 'https:') */
  readonly protocol: string;
  /** The subdomain part of the URL (e.g. 'www' in www.example.com), null if none */
  readonly subdomain: string | null;
  /** The domain name (e.g. 'example.com') */
  readonly domain: string;
  /** The port number, if specified */
  readonly port: number;
  /** The URL path after the domain */
  readonly path: string;
  /** Collection of URL query parameters */
  readonly queries: IReadonlyCollection<string, ScalarType>;
  /** The fragment identifier after '#' in the URL */
  readonly fragment: string;
  /** The base URL without path, query parameters or fragment */
  readonly base: string;
  /** The origin of the URL (protocol + domain + port) */
  readonly origin: string;
  /** The native URL object */
  readonly native: URL;
}
