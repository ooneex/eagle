import { bgBrightGreen, black } from 'jsr:@std/fmt/colors';
import { intro, select } from 'npm:@clack/prompts';
import { ControllerMaker } from './ControllerMaker.ts';
import { ModuleMaker } from './ModuleMaker.ts';
import { RepositoryMaker } from './RepositoryMaker.ts';
import { ServiceMaker } from './ServiceMaker.ts';

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
  ],
});

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
}
