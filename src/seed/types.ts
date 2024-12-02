/**
 * Interface for database seed operations.
 */
export interface ISeed {
  /**
   * Executes the seed operation.
   * @param previousData Optional data from previous seed operations
   * @returns Promise or direct value with the seed operation result
   */
  execute: (previousData?: any) => Promise<any> | any;

  /**
   * Gets the execution order of this seed.
   * @returns Numeric order value determining when this seed should run
   */
  getOrder: () => number;
}
