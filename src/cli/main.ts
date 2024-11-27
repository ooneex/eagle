import { bgBrightGreen, black } from 'jsr:@std/fmt/colors';
import { intro, select } from 'npm:@clack/prompts';
import { ModuleMaker } from './ModuleMaker.ts';

intro(bgBrightGreen(black('   Eagle code generator   ')));

const componentType = await select({
  message: 'Pick a component',
  options: [
    { value: 'module', label: 'Module' },
    { value: 'controller', label: 'Controller' },
    { value: 'repository', label: 'Repository' },
    { value: 'validator', label: 'Validator' },
    { value: 'middleware', label: 'Middleware' },
  ],
});

switch (componentType) {
  case 'module':
    await ModuleMaker.execute();
    break;
}
