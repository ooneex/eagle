import { Glob } from 'bun';

const typesGlob = new Glob('**/*.test.d.ts');
const typesDir = './dist';
for (const file of typesGlob.scanSync(typesDir)) {
  // @ts-ignore
  await Bun.file(`${typesDir}/${file}`).delete();
}

try {
  // @ts-ignore
  await Bun.file('tsconfig.types.tsbuildinfo').delete();
} catch (_e) {}

await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  splitting: false,
  minify: false,
  format: 'esm',
  target: 'bun',
});
