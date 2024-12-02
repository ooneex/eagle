/**
 * CLI module for generating Eagle project components.
 *
 * This module provides an interactive command-line interface to scaffold various
 * components like controllers, services, repositories etc. for Eagle projects.
 *
 * @module cli
 *
 * @example
 * ```ts
 * // Run the CLI generator
 * deno run -A cli/main.ts
 *
 * // Select component type from menu:
 * // ▪ Assert
 * // ▪ Config
 * // ▪ Controller
 * // etc...
 * ```
 *
 * @example
 * ```ts
 * // Generate a controller
 * > Controller
 * > Enter name: User
 * > Select methods: [x] GET [x] POST [ ] PUT [ ] DELETE
 * > Generated: src/controllers/UserController.ts
 * ```
 *
 * @example
 * ```ts
 * // Generate a CRUD controller
 * > Controller (CRUD)
 * > Enter name: ProductController
 * > Generated:
 * > - src/controllers/ProductController.ts
 * > - src/services/ProductService.ts
 * > - src/repositories/ProductRepository.ts
 * ```
 */

import { bgBrightGreen, black } from 'jsr:@std/fmt@1.0.3/colors';
import { cancel, intro, isCancel, select } from 'npm:@clack/prompts@0.8.2';
import { AssertMaker } from './AssertMaker.ts';
import { ConfigMaker } from './ConfigMaker.ts';
import { ControllerMaker } from './ControllerMaker.ts';
import { CrudMaker } from './CrudMaker.ts';
import { MailerMaker } from './MailerMaker.ts';
import { MiddlewareMaker } from './MiddlewareMaker.ts';
import { ModuleMaker } from './ModuleMaker.ts';
import { PermissionMaker } from './PermissionMaker.ts';
import { RepositoryMaker } from './RepositoryMaker.ts';
import { SchemaMaker } from './SchemaMaker.ts';
import { SeedMaker } from './SeedMaker.ts';
import { ServiceMaker } from './ServiceMaker.ts';
import { StorageMaker } from './StorageMaker.ts';
import { ValidatorMaker } from './ValidatorMaker.ts';

intro(bgBrightGreen(black('   Eagle project code generator   ')));

const componentType = await select({
  message: 'Component',
  options: [
    { value: 'assert', label: 'Assert' },
    { value: 'config', label: 'Config' },
    { value: 'controller', label: 'Controller' },
    { value: 'crud', label: 'Controller (CRUD)' },
    { value: 'mailer', label: 'Mailer' },
    { value: 'middleware', label: 'Middleware' },
    { value: 'module', label: 'Module' },
    { value: 'permission', label: 'Permission' },
    { value: 'repository', label: 'Repository' },
    { value: 'schema', label: 'Schema' },
    { value: 'seed', label: 'Seed' },
    { value: 'service', label: 'Service' },
    { value: 'storage', label: 'Storage' },
    { value: 'validator', label: 'Validator' },
  ],
});

if (isCancel(componentType)) {
  cancel('Cancelled!');
  Deno.exit(0);
}

switch (componentType) {
  case 'module':
    await ModuleMaker.execute();
    break;
  case 'controller':
    await ControllerMaker.execute();
    break;
  case 'crud':
    await CrudMaker.execute();
    break;
  case 'mailer':
    await MailerMaker.execute();
    break;
  case 'storage':
    await StorageMaker.execute();
    break;
  case 'service':
    await ServiceMaker.execute();
    break;
  case 'schema':
    await SchemaMaker.execute();
    break;
  case 'repository':
    await RepositoryMaker.execute();
    break;
  case 'validator':
    await ValidatorMaker.execute();
    break;
  case 'assert':
    await AssertMaker.execute();
    break;
  case 'config':
    await ConfigMaker.execute();
    break;
  case 'middleware':
    await MiddlewareMaker.execute();
    break;
  case 'seed':
    await SeedMaker.execute();
    break;
  case 'permission':
    await PermissionMaker.execute();
    break;
}
