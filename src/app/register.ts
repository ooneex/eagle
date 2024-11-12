import { DocContainer } from '@/doc/container.ts';
import { Doc } from '@/doc/Doc.ts';
import { File } from '@/file/File.ts';

const file = new File(Deno.cwd());

const controllers = file.list({
  recursive: true,
  match:
    /(Controller|Service|Middleware|Filter|Repository|Validator|Dto|Config|Entity|Command)\.ts$/,
});

for (const controller of controllers) {
  const doc = new Doc(controller);
  const data = await doc.parse();
  for (const datum of data) {
    const d = new Doc();
    d.setDocs([datum]);

    DocContainer.add(datum.name, d);
  }
}
