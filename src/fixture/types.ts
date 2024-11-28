export interface IFixture {
  execute: () => Promise<void> | void;
  getOrder: () => number;
}
