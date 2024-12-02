import { DocContainer } from '../doc/container.ts';
import { container } from './Container.ts';
import { ContainerException } from './ContainerException.ts';

/**
 * Gets the dependencies for a given class key by analyzing its constructor parameters
 *
 * @param key - The class name to get dependencies for
 * @returns Array of dependency class names
 * @throws ContainerException if circular dependencies are detected
 */
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

/**
 * Resolves dependencies for a given class key by getting instances from the container
 *
 * @param key - The class name to resolve dependencies for
 * @returns Array of resolved dependency instances
 */
export const resolveDependencies = (
  key: string,
): unknown[] => {
  const dependencies = getDependencies(key);

  if (!dependencies) {
    return [];
  }

  const resolvedDependencies = dependencies.map((dependency) =>
    container.get(dependency)
  );

  return resolvedDependencies;
};
