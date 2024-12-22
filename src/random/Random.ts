import { customAlphabet } from 'npm:nanoid@3.0.0';

export class Random {
  public static uuid(): string {
    return crypto.randomUUID();
  }

  public static nanoid(size?: number): string {
    return customAlphabet('1234567890abcdef', size ?? 10)();
  }

  public static nanoidFactory(size?: number): (size?: number) => string {
    return customAlphabet('1234567890abcdef', size ?? 10);
  }
}
