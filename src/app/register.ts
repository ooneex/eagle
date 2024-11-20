import { DocContainer } from '../doc/container.ts';
import { Doc } from '../doc/Doc.ts';
import { File } from '../file/File.ts';

export const register = async (resources?: string[], overwrite = false) => {
  if (!resources) {
    const file = new File(`${Deno.cwd()}/src`);
    resources = file.list({
      recursive: true,
      match:
        /(Controller|Service|Config|Validator|Database|Repository|Middleware|Filter|Dto|Command)\.ts$/,
    });
  }

  if (overwrite) {
    DocContainer.clear();
  }

  for (const resource of resources) {
    const doc = new Doc(resource);
    const data = await doc.parse();
    for (const datum of data) {
      const d = new Doc();
      d.setDocs([datum]);

      DocContainer.add(datum.name, d);
    }
  }
};
