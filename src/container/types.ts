/**
 * Defines the scope types available for dependency injection containers.
 * Each type represents a different layer or component in the application architecture:
 */
export type ContainerScopeType =
  | 'default'
  | 'middleware'
  | 'service'
  | 'storage'
  | 'repository'
  | 'database'
  | 'validator'
  | 'assert'
  | 'config'
  | 'controller'
  | 'seed'
  | 'mailer'
  | 'permission';
