export interface IValidator {
  getScope: () => 'payload' | 'params' | 'queries' | null;
}

export interface IAssert {
  validate: (
    value: unknown,
  ) => { success: boolean; message: string; key?: string };
}
