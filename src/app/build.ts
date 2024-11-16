import { File } from '@/file/File.ts';
import { build } from '@esbuild';

// const file = new File(`${Deno.cwd()}/src`);
const file = new File(`${Deno.cwd()}`);

const resources = file.list({
  recursive: true,
  match: /Entity\.ts$/,
});

for (const resource of resources) {
  await build({
    entryPoints: [resource],
    bundle: true,
    loader: { '.ts': 'ts' },
    write: true,
    allowOverwrite: true,
    outdir: 'build',
  });
}
