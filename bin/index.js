#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Usage: npx ask-temp <project-name>');
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
const templateDir = path.resolve(__dirname, '..');

if (fs.existsSync(targetDir)) {
  console.error(`Error: Directory "${projectName}" already exists.`);
  process.exit(1);
}

const IGNORE = new Set([
  'node_modules', '.next', 'bin', '.git', 'out', 'build', 'coverage', '.turbo'
]);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    if (IGNORE.has(entry)) continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`\nCreating project "${projectName}"...`);
copyDir(templateDir, targetDir);

// Reset package.json name to project name
const pkgPath = path.join(targetDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.name = projectName;
  delete pkg.bin;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

console.log('Installing dependencies...\n');
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

console.log(`\nDone! Get started:\n\n  cd ${projectName}\n  npm run dev\n`);
