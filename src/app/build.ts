import { build } from 'npm:esbuild';
import { File } from '../file/File.ts';

const file = new File(`${Deno.cwd()}/src`);

const resources = file.list({
  recursive: true,
  match: /Entity\.ts$/,
});

await build({
  entryPoints: [
    ...[...resources, `${Deno.cwd()}/database/sources`].map((resource) => ({
      in: resource,
      out: `${resource.replace(`${Deno.cwd()}/`, '').replace('.ts', '.js')}`,
    })),
  ],
  bundle: false,
  loader: { '.ts': 'ts' },
  write: true,
  allowOverwrite: true,
  platform: 'node',
  format: 'cjs',
  outdir: `${Deno.cwd()}/build`,
});
