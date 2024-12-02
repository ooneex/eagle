import { DocContainer } from '../doc/container.ts';
import { Doc } from '../doc/Doc.ts';
import { ClassDocType } from '../doc/types.ts';
import { File } from '../file/File.ts';

/**
 * Registers documentation for the provided resources or scans for TypeScript files matching specific patterns
 *
 * @param resources Optional array of resource file paths to generate documentation for
 * @param cache Optional cache directory path. Defaults to {cwd}/var/cache/docs
 *
 * This function:
 * 1. If no resources provided, scans src directory for TypeScript files matching component patterns
 * 2. Creates cache directory if it doesn't exist
 * 3. For each resource:
 *   - Checks if cached documentation exists and is up to date
 *   - If not cached or outdated, generates new documentation and caches it
 *   - Adds parsed documentation to the DocContainer
 */
export const register = async (
  resources?: string[],
  cache?: string,
): Promise<void> => {
  if (!resources) {
    const file = new File(`${Deno.cwd()}/src`);
    resources = file.list({
      recursive: true,
      match:
        /(Controller|Service|Config|Validator|Database|Repository|Middleware|Permission|Seed|Mailer|VectorDatabase|Storage)\.ts$/,
    });
  }

  const cacheDir = `${cache ?? Deno.cwd()}/var/cache/docs`;
  await Deno.mkdir(cacheDir, { recursive: true });
  const docsJsonFile = new File(`${cacheDir}/docs.json`);
  if (!(docsJsonFile.exists())) {
    await docsJsonFile.writeJson({});
  }

  const jsonCached = await docsJsonFile.readJson<Record<string, string>>();

  for (const resource of resources) {
    const stat = await Deno.stat(resource);

    const cacheFile = `${cacheDir}/${
      resource.replace(`${Deno.cwd()}/src/`, '').replace(/\.ts$/, '.json')
    }`;

    const file = new File(cacheFile);

    let data: ClassDocType[] = [];
    if (
      file.exists() &&
      jsonCached[resource] === `${stat.mtime?.getTime()}`
    ) {
      data = await file.readJson<ClassDocType[]>();
    } else {
      await Deno.mkdir(cacheFile.replace(/\/[^\/]+\.json$/, ''), {
        recursive: true,
      });

      const doc = new Doc(resource);
      data = await doc.parse();

      await file.writeJson(data, {
        create: true,
      });

      jsonCached[resource] = `${stat.mtime?.getTime()}`;
      await docsJsonFile.writeJson(jsonCached);
    }

    for (const datum of data) {
      const d = new Doc();
      d.setDocs([datum]);

      DocContainer.add(datum.name, d);
    }
  }
};
