import { container } from '../container/Container.ts';
import { DocContainer } from '../doc/container.ts';
import { assertMapper } from './mapper.ts';
import { IAssert, IValidator, ValidationResultType } from './types.ts';
import { ValidationException } from './ValidationException.ts';

/**
 * Validates data against a validator instance by checking property assertions and constraints
 *
 * @param validator - The validator instance to validate against
 * @param data - Unknown data to validate
 * @returns ValidationResultType containing success status and validation details
 *
 * @example
 * ```ts
 * class UserValidator implements IValidator {
 *   name: string;
 *   age: number;
 * }
 *
 * const validator = new UserValidator();
 * const data = { name: "John", age: 25 };
 *
 * const result = validate(validator, data);
 * // {
 * //   success: true,
 * //   details: [
 * //     { property: "name", success: true, message: "" },
 * //     { property: "age", success: true, message: "" }
 * //   ]
 * // }
 * ```
 */
export const validate = (
  validator: IValidator,
  data: unknown,
): ValidationResultType => {
  const name = validator.constructor.name;
  const doc = DocContainer.get(name);

  if (!doc) {
    throw new ValidationException('Validator definition not found', {
      validator: name,
    });
  }

  const properties = doc.findProperties();

  const details: ValidationResultType['details'] = [];

  for (const property of properties) {
    let assertions: string[] | null = property.isOptional
      ? ['AssertUndefined']
      : null;
    let constraints: { name: string; isArray: boolean }[] | null = null;
    const value = (data as Record<string, unknown>)[property.name];

    for (const t of property.types) {
      let type = t.replace(/\[.*\]$/, 'Array');

      if (assertMapper[type]) {
        if (!assertions) {
          assertions = [];
        }
        type = assertMapper[type];
        assertions.push(type);
        continue;
      }

      if (t.startsWith('Assert')) {
        if (!assertions) {
          assertions = [];
        }
        assertions.push(type);
        continue;
      }

      if (!constraints) {
        constraints = [];
      }

      constraints.push({
        name: t.replace(/\[.*\]$/, ''),
        isArray: /\[.*\]$/.test(t),
      });
    }

    let invalid: ReturnType<IAssert['validate']> | null = null;

    if (assertions) {
      const isValid = assertions.some((assertion) => {
        const assert = container.get<IAssert>(assertion, 'assert');

        if (!assert || !assert.validate) {
          throw new ValidationException(`Cannot find ${assertion}`, {
            assert: assertion,
            validator: name,
            property: property.name,
          });
        }

        const result = assert.validate(value);

        if (!result.success && !invalid) {
          invalid = {
            success: false,
            message: result.message,
          };
        }

        return result.success;
      });

      if (isValid) {
        details.push({
          property: property.name,
          success: true,
          message: '',
        });
        continue;
      }
    }

    if (constraints) {
      const isValid = constraints.some((constraint) => {
        const dep = container.get(constraint.name);

        if (!dep) {
          throw new ValidationException(`Cannot find ${constraint.name}`, {
            type: constraint.name,
            validator: name,
            property: property.name,
          });
        }

        let isValid = false;

        if (constraint.isArray) {
          isValid = Array.isArray(value) &&
            value.every((v) => v.constructor.name === dep.constructor.name);

          if (!isValid && !invalid) {
            invalid = {
              success: false,
              message:
                `${property.name} must be an array of ${dep.constructor.name}`,
            };
          }
        } else {
          isValid = (value as any).constructor.name === dep.constructor.name;

          if (!isValid && !invalid) {
            invalid = {
              success: false,
              message: `${property.name} must be a ${dep.constructor.name}`,
            };
          }
        }

        return isValid;
      });

      if (isValid) {
        details.push({
          property: property.name,
          success: true,
          message: '',
        });
        continue;
      }
    }

    let message = `Validation failed for ${property.name}`;

    if (invalid) {
      message += `. ${(invalid as ReturnType<IAssert['validate']>).message}`;
    }

    details.push({
      property: property.name,
      success: false,
      message,
    });
  }

  return {
    success: details.every((detail) => detail.success),
    details,
  };
};
