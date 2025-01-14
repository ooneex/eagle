import { Glob } from 'bun';

const glob = new Glob('**/*.test.d.ts');

for (const file of glob.scanSync('./dist')) {
  // @ts-ignore
  await Bun.file(`./dist/${file}`).delete();
}

try {
  // @ts-ignore
  await Bun.file('tsconfig.types.tsbuildinfo').delete();
} catch (_e) {}
