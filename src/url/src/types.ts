import type { IReadonlyCollection } from "@ooneex/collection";
import type { ScalarType } from "@ooneex/types";

/**
 * Represents a URL.
 */
export interface IUrl {
  readonly protocol: string;
  readonly subdomain: string | null;
  readonly domain: string;
  readonly port: number;
  readonly path: string;
  readonly queries: IReadonlyCollection<string, ScalarType>;
  readonly fragment: string;
  readonly base: string;
  readonly origin: string;
  readonly raw: string;
}
