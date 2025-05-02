import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs'],
  outExtension: () => ({ js: '.cjs' }),
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  target: 'es2018',
  onSuccess: async () => {
    console.log('tsup build completed. Output files:');
    const { readdir } = await import('fs/promises');
    const files = await readdir('dist');
    console.log(files);
  },
});
