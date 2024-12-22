import { customAlphabet } from 'npm:nanoid';

export class Random {
  public static uuid() {
    return crypto.randomUUID();
  }

  public static nanoid(size?: number): string {
    return customAlphabet('1234567890abcdef', 10)(size);
  }

  public static nanoidFactory(size?: number): (size?: number) => string {
    return customAlphabet('1234567890abcdef', size);
  }
}
