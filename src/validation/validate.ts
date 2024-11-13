import { DocContainer } from '@/doc/container.ts';
import { assertMapper } from '@/validation/mapper.ts';
import { IValidator } from '@/validation/types.ts';
import { ValidationException } from '@/validation/ValidationException.ts';

export const validate = (validator: IValidator) => {
  const name = validator.constructor.name;
  const doc = DocContainer.get(name);

  if (!doc) {
    throw new ValidationException('Validator definition not found', {
      name,
    });
  }

  const properties = doc.findProperties();

  for (const property of properties) {
    const constraints: string[] = [];

    for (const t of property.types) {
      let type = t.replace(/\[.*\]$/, 'Array');

      if (assertMapper[type]) {
        type = assertMapper[type];
      }

      constraints.push(t);
    }

    console.log(property);

    constraints.push(property.name);
    // const assert = new AssertArray();
  }
};
