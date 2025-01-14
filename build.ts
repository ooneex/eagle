import { Glob } from 'bun';
import packageJson from './package.json';

const typesGlob = new Glob('**/*.test.d.ts');
const typesDir = './dist/types';
for (const file of typesGlob.scanSync(typesDir)) {
  // biome-ignore lint/suspicious/noConsoleLog: trust me
  console.log(`Deleting ${file}`);
  // @ts-ignore
  await Bun.file(`${typesDir}/${file}`).delete();
}

try {
  // @ts-ignore
  await Bun.file('tsconfig.types.tsbuildinfo').delete();
} catch (_e) {}

const sourceGlob = new Glob('*/index.ts');
const sourceFiles: string[] = ['./src/index.ts'];
const exports: Record<string, { types: string; import: string }> = {
  '.': {
    types: './dist/types/index.d.ts',
    import: './dist/src/index.js',
  },
};
for (const file of sourceGlob.scanSync('./src')) {
  sourceFiles.push(`./src/${file}`);
  exports[`./${file.replace('/index.ts', '')}`] = {
    types: `./dist/types/${file.replace('.ts', '.d.ts')}`,
    import: `./dist/src/${file.replace('.ts', '.js')}`,
  };
}

await Bun.build({
  entrypoints: sourceFiles,
  outdir: './dist',
  splitting: true,
  minify: false,
  format: 'esm',
  target: 'bun',
  sourcemap: 'inline',
  naming: '[dir]/[name].[ext]',
});

// @ts-ignore: trust me
packageJson.exports = exports;
await Bun.write('./package.json', JSON.stringify(packageJson, null, 2));
