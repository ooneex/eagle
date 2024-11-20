import { build } from 'npm:esbuild';
import { File } from '../file/File.ts';

try {
  await Deno.remove(`${Deno.cwd()}/build`, { recursive: true });
} catch (_err) {
  // Trust me, it's already removed
}

const file = new File(`${Deno.cwd()}/src`);

let resources = file.list({
  recursive: true,
  match: /Entity\.ts$/,
});

resources = [...resources, `${Deno.cwd()}/database/sources`];

await build({
  entryPoints: [
    ...resources.map((resource) => ({
      in: resource,
      out: `${resource.replace(`${Deno.cwd()}/`, '').replace('.ts', '.js')}`,
    })),
  ],
  bundle: false,
  loader: { '.ts': 'ts' },
  write: true,
  allowOverwrite: true,
  platform: 'node',
  format: 'esm',
  outdir: `${Deno.cwd()}/build`,
});
