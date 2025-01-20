import type { IReadonlyCollection } from '../collection/types';
import type { ScalarType } from '../types';

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
  readonly native: URL;
}
