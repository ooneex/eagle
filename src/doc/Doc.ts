import {
  ClassDocType,
  ConstructorDocType,
  ConstructorParamDocType,
  IDoc,
  MethodDocType,
  MethodParamDocType,
  PropertyDocType,
} from './types.ts';

/**
 * Main documentation class that implements the IDoc interface
 */
export class Doc implements IDoc {
  /** Array of parsed class documentation */
  private docs: ClassDocType[] = [];

  /**
   * Creates a new Doc instance
   * @param filePath Optional path to TypeScript file to parse
   */
  constructor(private readonly filePath?: string) {}

  /**
   * Sets the documentation array directly
   * @param docs Array of class documentation to set
   */
  public setDocs(docs: ClassDocType[]): void {
    this.docs = docs;
  }

  /**
   * Parses TypeScript file and extracts class documentation
   * @returns Array of parsed class documentation
   */
  public async parse(): Promise<ClassDocType[]> {
    if (!this.filePath) {
      return [];
    }

    const command = new Deno.Command('deno', {
      args: ['doc', '--json', this.filePath],
    });

    const { stdout } = await command.output();
    const output: any = JSON.parse(new TextDecoder().decode(stdout));

    const docs: ClassDocType[] = [];

    for (const node of output.nodes) {
      if (node.kind !== 'class') continue;

      const methods: MethodDocType[] = [];
      for (const method of node?.classDef?.methods ?? []) {
        if (method.kind !== 'method') continue;
        const params: MethodParamDocType[] = [];
        for (const param of method?.functionDef?.params ?? []) {
          let types: string[] = [];
          if (
            param.tsType.kind === 'keyword' ||
            param.tsType.kind === 'typeRef'
          ) {
            types = [param.tsType.repr];
          }
          if (param.tsType.kind === 'array') {
            types = [`${param.tsType.array.repr}[]`];
          }

          if (param.tsType.kind === 'union') {
            for (const type of param.tsType.union) {
              types.push(type.repr);
            }
          }

          params.push({
            name: param.name,
            types,
            isOptional: param.optional,
          });
        }

        methods.push({
          name: method.name,
          isAbstract: method.isAbstract,
          isStatic: method.isStatic,
          isOptional: method.optional,
          accessibility: method.accessibility,
          isAsync: method.functionDef.isAsync,
          isGenerator: method.functionDef.isGenerator ?? false,
          returnType: method?.functionDef?.returnType?.repr ?? null,
          parameters: params,
        });
      }

      let constructorDoc: ConstructorDocType | null = null;
      const c = node?.classDef?.constructors?.[0];

      if (c) {
        const params: ConstructorParamDocType[] = [];
        for (const param of c.params ?? []) {
          let types: string[] = [];
          if (
            param.tsType.kind === 'keyword' ||
            param.tsType.kind === 'typeRef'
          ) {
            types = [param.tsType.repr];
          }
          if (param.tsType.kind === 'array') {
            types = [`${param.tsType.array.repr}[]`];
          }

          if (param.tsType.kind === 'union') {
            for (const type of param.tsType.union) {
              types.push(type.repr);
            }
          }

          params.push({
            name: param.name,
            isOptional: param.optional,
            types,
            accessibility: param.accessibility,
            isReadonly: param.readonly,
          });
        }
        constructorDoc = {
          name: c.name,
          accessibility: c.accessibility,
          parameters: params,
        };
      }

      const properties: PropertyDocType[] = [];
      for (const property of node?.classDef?.properties ?? []) {
        let types: string[] = [];
        if (
          property.tsType && (
            property.tsType.kind === 'keyword' ||
            property.tsType.kind === 'typeRef'
          )
        ) {
          types = [property.tsType.repr];
        }

        if (property.tsType && property.tsType.kind === 'array') {
          types = [`${property.tsType.array.repr}[]`];
        }

        if (property.tsType && property.tsType.kind === 'union') {
          for (const type of property.tsType.union) {
            types.push(type.repr);
          }
        }

        properties.push({
          name: property.name,
          types,
          isReadonly: property.readonly,
          accessibility: property.accessibility,
          isOptional: property.optional,
          isAbstract: property.isAbstract,
          isStatic: property.isStatic,
        });
      }

      docs.push({
        name: node.name,
        isDefault: node.isDefault,
        isExported: node.declarationKind === 'export',
        isAbstract: node.classDef.isAbstract,
        constructor: constructorDoc,
        properties,
        methods,
      });
    }

    this.docs = docs;

    return docs;
  }

  /**
   * Finds classes matching the given criteria
   * @param criteria Optional search criteria for filtering classes
   * @returns Array of matching class documentation
   */
  public findClasses(
    criteria?:
      & Partial<
        Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
      >
      & {
        name?: string | RegExp;
        constructor?:
          & Partial<Omit<ConstructorDocType, 'name' | 'parameters'>>
          & {
            name?: string | RegExp;
            parameters?: Partial<Omit<ConstructorParamDocType, 'name'>> & {
              name?: string | RegExp;
            };
          };
        properties?: Partial<Omit<PropertyDocType, 'name'>> & {
          name?: string | RegExp;
        };
        methods?: Partial<Omit<MethodDocType, 'name' | 'parameters'>> & {
          name?: string | RegExp;
          parameters?: Partial<Omit<MethodParamDocType, 'name'>> & {
            name?: string | RegExp;
          };
        };
      },
  ): ClassDocType[] {
    if (!criteria) {
      criteria = {};
    }

    const classes: ClassDocType[] = [];

    for (const doc of this.docs) {
      if (criteria.name) {
        if (criteria.name instanceof RegExp) {
          if (!criteria.name.test(doc.name)) continue;
        } else if (doc.name !== criteria.name) {
          continue;
        }
      }

      // Check class-level criteria
      if (
        criteria.isAbstract !== undefined &&
        doc.isAbstract !== criteria.isAbstract
      ) continue;

      if (
        criteria.isDefault !== undefined &&
        doc.isDefault !== criteria.isDefault
      ) continue;

      if (
        criteria.isExported !== undefined &&
        doc.isExported !== criteria.isExported
      ) continue;

      // deno-lint-ignore no-prototype-builtins
      if (criteria.hasOwnProperty('constructor')) {
        if (!doc.constructor) continue;

        if (
          // @ts-ignore: trust me
          criteria.constructor.accessibility !== undefined &&
          // @ts-ignore: trust me
          doc.constructor.accessibility !== criteria.constructor.accessibility
        ) continue;

        // @ts-ignore: trust me
        if (criteria.constructor.parameters) {
          // @ts-ignore: trust me
          const paramCriteria = criteria.constructor.parameters;
          const hasMatchingParam = doc.constructor.parameters.some((param) => {
            if (paramCriteria.name) {
              if (paramCriteria.name instanceof RegExp) {
                if (!paramCriteria.name.test(param.name)) return false;
              } else if (param.name !== paramCriteria.name) {
                return false;
              }
            }
            if (
              paramCriteria.isOptional !== undefined &&
              param.isOptional !== paramCriteria.isOptional
            ) return false;
            if (
              paramCriteria.types !== undefined &&
              !param.types.some((type) => paramCriteria.types?.includes(type))
            ) return false;
            return true;
          });
          if (!hasMatchingParam) continue;
        }
      }

      // Check properties criteria if specified
      if (criteria.properties) {
        const propCriteria = criteria.properties;
        const hasMatchingProp = doc.properties.some((prop) => {
          if (propCriteria.name) {
            if (propCriteria.name instanceof RegExp) {
              if (!propCriteria.name.test(prop.name)) return false;
            } else if (prop.name !== propCriteria.name) {
              return false;
            }
          }
          if (
            propCriteria.types !== undefined &&
            !prop.types.some((type) => propCriteria.types?.includes(type))
          ) return false;
          if (
            propCriteria.isOptional !== undefined &&
            prop.isOptional !== propCriteria.isOptional
          ) return false;
          if (
            propCriteria.isReadonly !== undefined &&
            prop.isReadonly !== propCriteria.isReadonly
          ) return false;
          if (
            propCriteria.accessibility !== undefined &&
            prop.accessibility !== propCriteria.accessibility
          ) return false;
          if (
            propCriteria.isAbstract !== undefined &&
            prop.isAbstract !== propCriteria.isAbstract
          ) return false;
          if (
            propCriteria.isStatic !== undefined &&
            prop.isStatic !== propCriteria.isStatic
          ) return false;
          return true;
        });
        if (!hasMatchingProp) continue;
      }

      // Check methods criteria if specified
      if (criteria.methods) {
        const methodCriteria = criteria.methods;
        const hasMatchingMethod = doc.methods.some((method) => {
          if (methodCriteria.name) {
            if (methodCriteria.name instanceof RegExp) {
              if (!methodCriteria.name.test(method.name)) return false;
            } else if (method.name !== methodCriteria.name) {
              return false;
            }
          }
          if (
            methodCriteria.isAsync !== undefined &&
            method.isAsync !== methodCriteria.isAsync
          ) return false;
          if (
            methodCriteria.isAbstract !== undefined &&
            method.isAbstract !== methodCriteria.isAbstract
          ) return false;
          if (
            methodCriteria.isStatic !== undefined &&
            method.isStatic !== methodCriteria.isStatic
          ) return false;
          if (
            methodCriteria.accessibility !== undefined &&
            method.accessibility !== methodCriteria.accessibility
          ) return false;
          if (
            methodCriteria.returnType !== undefined &&
            method.returnType !== methodCriteria.returnType
          ) return false;

          // Check method parameters if specified
          if (methodCriteria.parameters) {
            const paramCriteria = methodCriteria.parameters;
            const hasMatchingParam = method.parameters.some((param) => {
              if (paramCriteria.name) {
                if (paramCriteria.name instanceof RegExp) {
                  if (!paramCriteria.name.test(param.name)) return false;
                } else if (param.name !== paramCriteria.name) {
                  return false;
                }
              }
              if (
                paramCriteria.isOptional !== undefined &&
                param.isOptional !== paramCriteria.isOptional
              ) return false;
              if (
                paramCriteria.types !== undefined &&
                !param.types.some((type) => paramCriteria.types?.includes(type))
              ) return false;
              return true;
            });
            if (!hasMatchingParam) return false;
          }
          return true;
        });
        if (!hasMatchingMethod) continue;
      }

      classes.push(doc);
    }

    return classes;
  }

  /**
   * Finds constructors matching the given criteria
   * @param criteria Optional search criteria for filtering constructors
   * @returns Array of matching constructor documentation
   */
  public findConstructors(
    criteria?: Partial<Omit<ConstructorDocType, 'name' | 'parameters'>> & {
      name?: string | RegExp;
      parameters?: Partial<Omit<ConstructorParamDocType, 'name'>> & {
        name?: string | RegExp;
      };
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
    },
  ): ConstructorDocType[] {
    if (!criteria) {
      criteria = {};
    }

    const constructors: ConstructorDocType[] = [];

    for (const doc of this.docs) {
      // Skip if no constructor
      if (!doc.constructor) continue;

      // Check class criteria if specified
      if (criteria.class) {
        if (criteria.class.name) {
          if (criteria.class.name instanceof RegExp) {
            if (!criteria.class.name.test(doc.name)) continue;
          } else if (doc.name !== criteria.class.name) {
            continue;
          }
        }
        if (
          criteria.class.isAbstract !== undefined &&
          doc.isAbstract !== criteria.class.isAbstract
        ) continue;
        if (
          criteria.class.isDefault !== undefined &&
          doc.isDefault !== criteria.class.isDefault
        ) continue;
        if (
          criteria.class.isExported !== undefined &&
          doc.isExported !== criteria.class.isExported
        ) continue;
      }

      let constructorMatch = true;

      // Check constructor criteria
      if (criteria.name) {
        if (criteria.name instanceof RegExp) {
          if (!criteria.name.test(doc.constructor.name)) continue;
        } else if (doc.constructor.name !== criteria.name) {
          continue;
        }
      }

      if (
        criteria.accessibility !== undefined &&
        doc.constructor.accessibility !== criteria.accessibility
      ) continue;

      // Check parameters if specified
      if (criteria.parameters) {
        for (const param of doc.constructor.parameters) {
          if (criteria.parameters.name) {
            if (criteria.parameters.name instanceof RegExp) {
              constructorMatch = criteria.parameters.name.test(param.name);
            } else {
              constructorMatch = param.name === criteria.parameters.name;
            }
          }
          if (
            criteria.parameters?.types !== undefined &&
            !param.types.some((type) =>
              criteria.parameters?.types?.includes(type)
            )
          ) continue;
          if (
            criteria.parameters.isOptional !== undefined &&
            param.isOptional !== criteria.parameters.isOptional
          ) continue;
          if (
            criteria.parameters.isReadonly !== undefined &&
            param.isReadonly !== criteria.parameters.isReadonly
          ) continue;
          if (
            criteria.parameters.accessibility !== undefined &&
            param.accessibility !== criteria.parameters.accessibility
          ) continue;
        }
      }

      if (!constructorMatch) continue;

      constructors.push(doc.constructor);
    }

    return constructors;
  }

  /**
   * Finds properties matching the given criteria
   * @param criteria Optional search criteria for filtering properties
   * @returns Array of matching property documentation
   */
  public findProperties(
    criteria?: Partial<Omit<PropertyDocType, 'name'>> & {
      name?: string | RegExp;
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
    },
  ): PropertyDocType[] {
    if (!criteria) {
      criteria = {};
    }

    const properties: PropertyDocType[] = [];

    for (const doc of this.docs) {
      // Check class criteria if specified
      if (criteria.class) {
        if (criteria.class.name) {
          if (criteria.class.name instanceof RegExp) {
            if (!criteria.class.name.test(doc.name)) continue;
          } else if (doc.name !== criteria.class.name) {
            continue;
          }
        }
        if (
          criteria.class.isAbstract !== undefined &&
          doc.isAbstract !== criteria.class.isAbstract
        ) continue;
        if (
          criteria.class.isDefault !== undefined &&
          doc.isDefault !== criteria.class.isDefault
        ) continue;
        if (
          criteria.class.isExported !== undefined &&
          doc.isExported !== criteria.class.isExported
        ) continue;
      }

      for (const property of doc.properties) {
        // Check property criteria
        if (criteria.name) {
          if (criteria.name instanceof RegExp) {
            if (!criteria.name.test(property.name)) continue;
          } else if (property.name !== criteria.name) {
            continue;
          }
        }

        if (
          criteria.types !== undefined &&
          !property.types.some((type) => criteria.types?.includes(type))
        ) continue;
        if (
          criteria.isOptional !== undefined &&
          property.isOptional !== criteria.isOptional
        ) continue;
        if (
          criteria.isReadonly !== undefined &&
          property.isReadonly !== criteria.isReadonly
        ) continue;
        if (
          criteria.accessibility !== undefined &&
          property.accessibility !== criteria.accessibility
        ) continue;
        if (
          criteria.isAbstract !== undefined &&
          property.isAbstract !== criteria.isAbstract
        ) continue;
        if (
          criteria.isStatic !== undefined &&
          property.isStatic !== criteria.isStatic
        ) continue;

        properties.push(property);
      }
    }

    return properties;
  }

  /**
   * Finds methods matching the given criteria
   * @param criteria Optional search criteria for filtering methods
   * @returns Array of matching method documentation
   */
  public findMethods(
    criteria?: Partial<Omit<MethodDocType, 'name' | 'parameters'>> & {
      name?: string | RegExp;
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
      parameters?: Partial<Omit<MethodParamDocType, 'name'>> & {
        name?: string | RegExp;
      };
    },
  ): MethodDocType[] {
    if (!criteria) {
      criteria = {};
    }

    const methods: MethodDocType[] = [];

    for (const doc of this.docs) {
      // Check class criteria if specified
      if (criteria.class) {
        if (criteria.class.name) {
          if (criteria.class.name instanceof RegExp) {
            if (!criteria.class.name.test(doc.name)) continue;
          } else if (doc.name !== criteria.class.name) {
            continue;
          }
        }
        if (
          criteria.class.isAbstract !== undefined &&
          doc.isAbstract !== criteria.class.isAbstract
        ) continue;
        if (
          criteria.class.isDefault !== undefined &&
          doc.isDefault !== criteria.class.isDefault
        ) continue;
        if (
          criteria.class.isExported !== undefined &&
          doc.isExported !== criteria.class.isExported
        ) continue;
      }

      for (const method of doc.methods) {
        // Check method criteria
        if (criteria.name) {
          if (criteria.name instanceof RegExp) {
            if (!criteria.name.test(method.name)) continue;
          } else if (method.name !== criteria.name) {
            continue;
          }
        }

        if (
          criteria.isAbstract !== undefined &&
          method.isAbstract !== criteria.isAbstract
        ) continue;
        if (
          criteria.isStatic !== undefined &&
          method.isStatic !== criteria.isStatic
        ) continue;
        if (
          criteria.isOptional !== undefined &&
          method.isOptional !== criteria.isOptional
        ) continue;
        if (
          criteria.isAsync !== undefined && method.isAsync !== criteria.isAsync
        ) continue;
        if (
          criteria.isGenerator !== undefined &&
          method.isGenerator !== criteria.isGenerator
        ) continue;
        if (
          criteria.accessibility !== undefined &&
          method.accessibility !== criteria.accessibility
        ) continue;
        if (
          criteria.returnType !== undefined &&
          method.returnType !== criteria.returnType
        ) continue;

        // Check parameter criteria if specified
        if (criteria.parameters) {
          let paramsMatch = true;
          for (const param of method.parameters) {
            if (criteria.parameters.name) {
              if (criteria.parameters.name instanceof RegExp) {
                if (!criteria.parameters.name.test(param.name)) {
                  paramsMatch = false;
                  break;
                }
              } else if (param.name !== criteria.parameters.name) {
                paramsMatch = false;
                break;
              }
            }
            if (
              criteria.parameters?.types !== undefined &&
              !param.types.some((t) => criteria.parameters?.types?.includes(t))
            ) {
              paramsMatch = false;
              break;
            }
            if (
              criteria.parameters.isOptional !== undefined &&
              param.isOptional !== criteria.parameters.isOptional
            ) {
              paramsMatch = false;
              break;
            }
          }
          if (!paramsMatch) continue;
        }

        methods.push(method);
      }
    }

    return methods;
  }

  /**
   * Finds parameters for a method in a specific class
   * @param className Name of the class containing the method
   * @param methodName Name of the method to find parameters for
   * @returns Array of parameter documentation for the method
   */
  public findParameters(
    className: string,
    methodName: string,
  ): MethodParamDocType[] {
    const actionDoc = this.findMethods({
      name: methodName,
      class: {
        name: className,
      },
    })[0];

    if (!actionDoc) {
      return [];
    }

    return actionDoc.parameters ?? [];
  }
}
