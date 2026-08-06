import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = 'C:/NH2';

// 1. Get all files tracked by Git
const gitFilesRaw = execSync('git ls-files', { cwd: rootDir }).toString();
const gitFiles = new Set(gitFilesRaw.split('\n').map(f => f.trim().replace(/\\/g, '/')).filter(Boolean));

// 2. Recursively find all files on disk
function getAllDiskFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');

    if (stat && stat.isDirectory()) {
      if (['node_modules', '.git', 'dist', '.vercel'].includes(file)) return;
      results = results.concat(getAllDiskFiles(filePath));
    } else {
      results.push(relPath);
    }
  });
  return results;
}

const diskFiles = getAllDiskFiles(rootDir);

const notInGit = diskFiles.filter(file => !gitFiles.has(file));

console.log('=== COMPARISON RESULT ===');
console.log(`Total files on disk (excluding node_modules/dist/.git): ${diskFiles.length}`);
console.log(`Total files tracked on GitHub: ${gitFiles.size}`);
console.log(`Files NOT on GitHub (${notInGit.length}):`);
console.log(JSON.stringify(notInGit, null, 2));
