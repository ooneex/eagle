import { DocContainer } from '@/doc/container.ts';
import { Doc } from '@/doc/Doc.ts';
import { File } from '@/file/File.ts';

const file = new File(Deno.cwd());

const resources = file.list({
  recursive: true,
  match:
    /(Controller|Service|Config|Validator|Middleware|Filter|Repository|Dto|Entity|Command)\.ts$/,
});

for (const resource of resources) {
  const doc = new Doc(resource);
  const data = await doc.parse();
  for (const datum of data) {
    const d = new Doc();
    d.setDocs([datum]);

    DocContainer.add(datum.name, d);
  }
}
