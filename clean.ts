import { Glob } from 'bun';

const glob = new Glob('**/*.test.d.ts');

for (const file of glob.scanSync('./dist')) {
  // biome-ignore lint/suspicious/noConsoleLog: trust me
  console.log(`Deleting ${file}`);
  // @ts-ignore
  await Bun.file(`./dist/${file}`).delete();
}

try {
  // @ts-ignore
  await Bun.file('tsconfig.types.tsbuildinfo').delete();
} catch (_e) {}
