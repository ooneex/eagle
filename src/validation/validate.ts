import { DocContainer } from '@/doc/container.ts';
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

  console.log(properties);
};
