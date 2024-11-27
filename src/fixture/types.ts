export interface IFixture {
  execute: () => Promise<void>;
  getOrder: () => number;
}
