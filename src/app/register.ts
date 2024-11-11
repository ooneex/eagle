import { DocContainer } from '@/doc/container.ts';
import { Doc } from '@/doc/Doc.ts';
import { File } from '@/file/File.ts';

const file = new File(Deno.cwd());

const controllers = file.list({
  recursive: true,
  match:
    /(Controller|Middleware|Filter|Service|Repository|Validator|Dto|Config)\.ts$/,
});

for (const controller of controllers) {
  const doc = new Doc(controller);
  const data = await doc.parse();
  for (const datum of data) {
    DocContainer.add(datum.name, datum);
  }
}
