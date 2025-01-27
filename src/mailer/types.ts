export interface IMailer {
  send: <T = any>(param?: any) => Promise<T> | T;
}
