import { readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

// Next 16 on Windows exports segment paths as directories, while its browser
// router requests dot-separated filenames. Keep both forms for static hosting.
async function walk(dir, segmentRoot) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    const root = segmentRoot ?? (entry.isDirectory() && entry.name.startsWith('__next.') ? dir : undefined);
    if (entry.isDirectory()) await walk(file, root);
    else if (root && entry.name.endsWith('.txt')) {
      await copyFile(file, path.join(root, path.relative(root, file).split(path.sep).join('.')));
    }
  }
}
await walk('out');
