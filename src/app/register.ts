import { DocContainer } from '../doc/container.ts';
import { Doc } from '../doc/Doc.ts';
import { ClassDocType } from '../doc/types.ts';
import { File } from '../file/File.ts';

export const register = async (resources?: string[]) => {
  if (!resources) {
    const file = new File(`${Deno.cwd()}/src`);
    resources = file.list({
      recursive: true,
      match:
        /(Controller|Service|Config|Validator|Database|Repository|Middleware)\.ts$/,
    });
  }

  const cacheDir = `${Deno.cwd()}/var/cache/docs`;
  await Deno.mkdir(cacheDir, { recursive: true });
  const docsJsonFile = new File(`${cacheDir}/docs.json`);
  if (!(await docsJsonFile.exists())) {
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
      await file.exists() &&
      jsonCached[resource] === `${stat.mtime?.getTime()}`
    ) {
      data = await file.readJson<ClassDocType[]>();
    } else {
      const resourceCacheDir = cacheFile.replace(/\/[^\/]+\.json$/, '');
      await Deno.mkdir(resourceCacheDir, { recursive: true });

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
