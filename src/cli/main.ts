import { bgBrightGreen, black, green } from 'jsr:@std/fmt/colors';
import { cancel, intro, isCancel, outro, select } from 'npm:@clack/prompts';
import { ConfigMaker } from './ConfigMaker.ts';
import { ControllerMaker } from './ControllerMaker.ts';
import { MiddlewareMaker } from './MiddlewareMaker.ts';
import { ModuleMaker } from './ModuleMaker.ts';
import { RepositoryMaker } from './RepositoryMaker.ts';
import { ServiceMaker } from './ServiceMaker.ts';
import { ValidatorMaker } from './ValidatorMaker.ts';

intro(bgBrightGreen(black('   Eagle code generator   ')));

const componentType = await select({
  message: 'Component',
  options: [
    { value: 'module', label: 'Module' },
    { value: 'controller', label: 'Controller' },
    { value: 'service', label: 'Service' },
    { value: 'repository', label: 'Repository' },
    { value: 'validator', label: 'Validator' },
    { value: 'config', label: 'Config' },
    { value: 'middleware', label: 'Middleware' },
    { value: 'fixture', label: 'Fixture' },
    { value: 'exit', label: 'Exit' },
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
  case 'service':
    await ServiceMaker.execute();
    break;
  case 'repository':
    await RepositoryMaker.execute();
    break;
  case 'validator':
    await ValidatorMaker.execute();
    break;
  case 'config':
    await ConfigMaker.execute();
    break;
  case 'middleware':
    await MiddlewareMaker.execute();
    break;
  case 'exit':
    outro(green('Bye!'));
    break;
}
