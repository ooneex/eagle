import { container } from '@/container/Container.ts';
import { ContainerException } from '@/container/ContainerException.ts';
import { ContainerScopeType } from '@/container/types.ts';
import { DocContainer } from '@/doc/container.ts';

export const getDependencies = (
  key: string,
): string[] => {
  const doc = DocContainer.get(key);

  if (!doc) {
    return [];
  }

  const constructorDoc = (doc.findConstructors({
    class: {
      name: key,
    },
  }))[0];

  if (!constructorDoc) {
    return [];
  }

  const dependencies: string[] = [];

  for (const parameter of constructorDoc.parameters) {
    const type = parameter.types[0];

    if (type === key) {
      throw new ContainerException(
        `Circular dependency detected: ${key} is dependent on itself`,
      );
    }

    const deps = getDependencies(type);

    if (deps.includes(key)) {
      throw new ContainerException(
        `Circular dependency detected: ${key} -> ${type} -> ${key}`,
      );
    }

    dependencies.push(type);
  }

  return dependencies;
};

export const resolveDependencies = (
  key: string,
  scope?: ContainerScopeType,
): unknown[] => {
  const dependencies = getDependencies(key);

  if (!dependencies) {
    return [];
  }

  const resolvedDependencies = dependencies.map((dependency) =>
    container.get(dependency, scope)
  );

  return resolvedDependencies;
};
