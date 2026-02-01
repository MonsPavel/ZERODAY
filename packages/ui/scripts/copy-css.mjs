import { mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = [
  {
    from: resolve(root, 'src/styles/base.css'),
    to: resolve(root, 'dist/styles/base.css'),
  },
  {
    from: resolve(root, 'src/styles/theme.css'),
    to: resolve(root, 'dist/styles/theme.css'),
  },
];

for (const file of files) {
  await mkdir(dirname(file.to), { recursive: true });
  await copyFile(file.from, file.to);
}
