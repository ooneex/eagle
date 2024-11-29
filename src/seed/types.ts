export interface ISeed {
  execute: (previousData?: any) => Promise<any> | any;
  getOrder: () => number;
}
