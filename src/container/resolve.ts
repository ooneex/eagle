import { container } from '@/container/Container.ts';
import { ContainerException } from '@/container/ContainerException.ts';
import { ContainerScopeType } from '@/container/types.ts';
import { DocContainer } from '@/doc/container.ts';
import { Doc } from '@/doc/Doc.ts';

export const getDependencies = async (
  key: string,
): Promise<string[] | null> => {
  const docDefinition = DocContainer.get(key);

  if (!docDefinition) {
    return null;
  }

  const doc = new Doc();
  doc.setDocs([docDefinition]);

  const constructorDoc = (await doc.findConstructors({
    name: key,
  }))[0];

  if (!constructorDoc) {
    return null;
  }

  let dependencies: string[] = [];

  for (const parameter of constructorDoc.parameters) {
    if (parameter.type === key) {
      throw new ContainerException(
        `Circular dependency detected: ${key} is dependent on itself`,
      );
    }

    const deps = await getDependencies(parameter.type);

    if (!deps) {
      dependencies.push(parameter.type);
      continue;
    }

    if (deps.includes(key)) {
      throw new ContainerException(
        `Circular dependency detected: ${key} -> ${parameter.type} -> ${key}`,
      );
    }

    dependencies = [...dependencies, ...deps];
  }

  return dependencies;
};

export const resolveDependencies = async (
  key: string,
  scope?: ContainerScopeType,
): Promise<unknown[] | null> => {
  const dependencies = await getDependencies(key);

  if (!dependencies) {
    return null;
  }

  const resolvedDependencies = await Promise.all(
    dependencies.map((dependency) => container.get(dependency, scope)),
  );

  return resolvedDependencies;
};
