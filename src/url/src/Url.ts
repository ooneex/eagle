import {
  type IReadonlyCollection,
  ReadonlyCollection,
} from "@ooneex/collection";
import { parseString, trim } from "@ooneex/helper";
import type { ScalarType } from "@ooneex/types";
import "urlpattern-polyfill";
import type { IUrl } from "./types";

/**
 * Represents a URL object.
 */
export class Url implements IUrl {
  public readonly protocol: string;
  public readonly subdomain: string | null;
  public readonly domain: string;
  public readonly port: number;
  public readonly path: string;
  public readonly queries: IReadonlyCollection<string, ScalarType>;
  public readonly fragment: string;
  public readonly base: string;
  public readonly origin: string;
  public readonly raw: string;

  constructor(url: string | URL) {
    const native = new URL(url);
    this.raw = native.toString();

    this.protocol = trim(native.protocol, ":");
    this.subdomain = null;
    this.domain = native.hostname;
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

    this.port = native.port ? parseString(native.port) : 80;
    this.path = native.pathname;
    this.fragment = trim(native.hash, "#");
    this.base = `${native.protocol}//${native.host}`;
    this.origin = native.origin;

    const parameters: [string, ScalarType][] = [];
    for (const [key, value] of native.searchParams) {
      parameters.push([key, parseString(value)]);
    }
    this.queries = new ReadonlyCollection<string, ScalarType>(parameters);
  }
}
