export interface IFixture {
  execute: (previousData?: any) => Promise<any> | any;
  getOrder: () => number;
}
