import {
  ClassDocType,
  ConstructorDocType,
  ConstructorParamDocType,
  MethodDocType,
  MethodParamDocType,
  PropertyDocType,
} from '@/doc/types.ts';

export class Doc {
  private docs: ClassDocType[] | null = null;

  constructor(private readonly filePath?: string) {}

  public setDocs(docs: ClassDocType[]): void {
    this.docs = docs;
  }

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
          params.push({
            name: param.name,
            type: param.tsType.repr,
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

      let constructor: ConstructorDocType | null = null;
      const c = node?.classDef?.constructors?.[0];

      if (c) {
        const params: ConstructorParamDocType[] = [];
        for (const param of c.params ?? []) {
          params.push({
            name: param.name,
            isOptional: param.optional,
            type: param.tsType.repr,
            accessibility: param.accessibility,
            isReadonly: param.readonly,
          });
        }
        constructor = {
          name: c.name,
          accessibility: c.accessibility,
          parameters: params,
        };
      }

      const properties: PropertyDocType[] = [];
      for (const property of node?.classDef?.properties ?? []) {
        properties.push({
          name: property.name,
          type: property.tsType.repr,
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
        constructor,
        properties,
        methods,
      });
    }

    return docs;
  }

  public async findClasses(
    criteria:
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
  ): Promise<ClassDocType[]> {
    if (!this.docs) {
      this.docs = await this.parse();
    }

    const classes: ClassDocType[] = [];

    for (const doc of this.docs) {
      // Check class criteria
      if (criteria.name) {
        if (criteria.name instanceof RegExp) {
          if (!criteria.name.test(doc.name)) continue;
        } else if (doc.name !== criteria.name) {
          continue;
        }
      }

      if (
        criteria.isAbstract !== undefined &&
        doc.isAbstract !== criteria.isAbstract
      ) continue;
      if (
        criteria.isDefault !== undefined && doc.isDefault !== criteria.isDefault
      ) continue;
      if (
        criteria.isExported !== undefined &&
        doc.isExported !== criteria.isExported
      ) continue;

      // Check constructor criteria if specified
      if (criteria.constructor) {
        if (!doc.constructor) continue;

        if (criteria.constructor.name) {
          if (criteria.constructor.name instanceof RegExp) {
            if (!criteria.constructor.name.test(doc.constructor.name)) continue;
          } else if (doc.constructor.name !== criteria.constructor.name) {
            continue;
          }
        }

        if (
          criteria.constructor.accessibility !== undefined &&
          doc.constructor.accessibility !== criteria.constructor.accessibility
        ) continue;

        // Check constructor parameters if specified
        if (criteria.constructor.parameters) {
          let paramsMatch = false;
          for (const param of doc.constructor.parameters) {
            if (criteria.constructor.parameters.name) {
              if (criteria.constructor.parameters.name instanceof RegExp) {
                paramsMatch = criteria.constructor.parameters.name.test(
                  param.name,
                );
              } else {
                paramsMatch =
                  param.name === criteria.constructor.parameters.name;
              }
            }
            if (
              criteria.constructor.parameters.type !== undefined &&
              param.type !== criteria.constructor.parameters.type
            ) continue;
            if (
              criteria.constructor.parameters.isOptional !== undefined &&
              param.isOptional !== criteria.constructor.parameters.isOptional
            ) continue;
            if (
              criteria.constructor.parameters.isReadonly !== undefined &&
              param.isReadonly !== criteria.constructor.parameters.isReadonly
            ) continue;
            if (
              criteria.constructor.parameters.accessibility !== undefined &&
              param.accessibility !==
                criteria.constructor.parameters.accessibility
            ) continue;
          }
          if (!paramsMatch) continue;
        }
      }

      // Check properties criteria if specified
      if (criteria.properties) {
        let propertiesMatch = false;
        for (const property of doc.properties) {
          if (criteria.properties.name) {
            if (criteria.properties.name instanceof RegExp) {
              propertiesMatch = criteria.properties.name.test(property.name);
            } else {
              propertiesMatch = property.name === criteria.properties.name;
            }
          }
          if (
            criteria.properties.type !== undefined &&
            property.type !== criteria.properties.type
          ) continue;
          if (
            criteria.properties.isOptional !== undefined &&
            property.isOptional !== criteria.properties.isOptional
          ) continue;
          if (
            criteria.properties.isReadonly !== undefined &&
            property.isReadonly !== criteria.properties.isReadonly
          ) continue;
          if (
            criteria.properties.accessibility !== undefined &&
            property.accessibility !== criteria.properties.accessibility
          ) continue;
          if (
            criteria.properties.isAbstract !== undefined &&
            property.isAbstract !== criteria.properties.isAbstract
          ) continue;
          if (
            criteria.properties.isStatic !== undefined &&
            property.isStatic !== criteria.properties.isStatic
          ) continue;
        }
        if (!propertiesMatch) continue;
      }

      // Check methods criteria if specified
      if (criteria.methods) {
        let methodsMatch = false;
        for (const method of doc.methods) {
          if (criteria.methods.name) {
            if (criteria.methods.name instanceof RegExp) {
              methodsMatch = criteria.methods.name.test(method.name);
            } else {
              methodsMatch = method.name === criteria.methods.name;
            }
          }
          if (
            criteria.methods.isAbstract !== undefined &&
            method.isAbstract !== criteria.methods.isAbstract
          ) continue;
          if (
            criteria.methods.isStatic !== undefined &&
            method.isStatic !== criteria.methods.isStatic
          ) continue;
          if (
            criteria.methods.isOptional !== undefined &&
            method.isOptional !== criteria.methods.isOptional
          ) continue;
          if (
            criteria.methods.isAsync !== undefined &&
            method.isAsync !== criteria.methods.isAsync
          ) continue;
          if (
            criteria.methods.isGenerator !== undefined &&
            method.isGenerator !== criteria.methods.isGenerator
          ) continue;
          if (
            criteria.methods.accessibility !== undefined &&
            method.accessibility !== criteria.methods.accessibility
          ) continue;
          if (
            criteria.methods.returnType !== undefined &&
            method.returnType !== criteria.methods.returnType
          ) continue;

          if (criteria.methods.parameters) {
            for (const param of method.parameters) {
              if (criteria.methods.parameters.name) {
                if (criteria.methods.parameters.name instanceof RegExp) {
                  methodsMatch = criteria.methods.parameters.name.test(
                    param.name,
                  );
                } else {
                  methodsMatch =
                    param.name === criteria.methods.parameters.name;
                }
              }
              if (
                criteria.methods.parameters.type !== undefined &&
                param.type !== criteria.methods.parameters.type
              ) continue;
              if (
                criteria.methods.parameters.isOptional !== undefined &&
                param.isOptional !== criteria.methods.parameters.isOptional
              ) continue;
            }
          }
        }
        if (!methodsMatch) continue;
      }

      classes.push(doc);
    }

    return classes;
  }

  public async findConstructors(
    criteria: Partial<Omit<ConstructorDocType, 'name' | 'parameters'>> & {
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
  ): Promise<ConstructorDocType[]> {
    if (!this.docs) {
      this.docs = await this.parse();
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
            criteria.parameters.type !== undefined &&
            param.type !== criteria.parameters.type
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

  public async findProperties(
    criteria: Partial<Omit<PropertyDocType, 'name'>> & {
      name?: string | RegExp;
      class?:
        & Partial<
          Omit<ClassDocType, 'name' | 'constructor' | 'properties' | 'methods'>
        >
        & {
          name?: string | RegExp;
        };
    },
  ): Promise<PropertyDocType[]> {
    if (!this.docs) {
      this.docs = await this.parse();
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
          criteria.type !== undefined &&
          property.type !== criteria.type
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

  public async findMethods(
    criteria: Partial<Omit<MethodDocType, 'name' | 'parameters'>> & {
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
  ): Promise<MethodDocType[]> {
    if (!this.docs) {
      this.docs = await this.parse();
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
              criteria.parameters.type !== undefined &&
              param.type !== criteria.parameters.type
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
}
