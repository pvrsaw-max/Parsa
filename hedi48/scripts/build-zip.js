import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const zip = new JSZip();

const IGNORED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  '.vite',
  'public/modiryar-project.zip',
];

function addFilesRecursively(dir, zipFolder) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (IGNORED_PATHS.some((ignored) => relPath.startsWith(ignored) || entry.name === 'node_modules')) {
      continue;
    }

    if (entry.isDirectory()) {
      const subFolder = zipFolder ? zipFolder.folder(entry.name) : zip.folder(entry.name);
      addFilesRecursively(fullPath, subFolder);
    } else {
      // Don't include the destination zip itself
      if (entry.name === 'modiryar-project.zip') continue;

      const content = fs.readFileSync(fullPath);
      if (zipFolder) {
        zipFolder.file(entry.name, content);
      } else {
        zip.file(entry.name, content);
      }
    }
  }
}

console.log('Packaging project into ZIP archive...');
addFilesRecursively(rootDir, null);

const outputPath = path.join(publicDir, 'modiryar-project.zip');

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
  .pipe(fs.createWriteStream(outputPath))
  .on('finish', () => {
    const stats = fs.statSync(outputPath);
    console.log(`Success! Project ZIP archive created at ${outputPath} (${Math.round(stats.size / 1024)} KB)`);
  })
  .on('error', (err) => {
    console.error('Error creating ZIP archive:', err);
    process.exit(1);
  });
