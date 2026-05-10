#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Root of the npm package (one level up from bin/)
const packageRoot = path.join(__dirname, '..');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    // Skip things that shouldn't be copied to the new project
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === '.playwright-mcp' ||
      entry.name === 'bin'
    ) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const args = process.argv.slice(2);

if (args.length >= 4) {
  const [projectName, frontendName, backendName, dbName] = args;
  run({ projectName, frontendName, backendName, dbName });
} else if (args.length === 0) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (p) => new Promise((r) => rl.question(p, r));

  async function main() {
    console.log('\n=== Project Initialization ===\n');
    const projectName = await question('Project name (e.g., my-project): ');
    const frontendName = await question('Frontend name (e.g., my-frontend): ');
    const backendName = await question('Backend name (e.g., my-backend): ');
    const dbName = await question('Database name (e.g., mydb): ');
    rl.close();
    run({ projectName, frontendName, backendName, dbName });
  }
  main();
} else {
  console.error('Usage: npx ask-temp <project> <frontend> <backend> <db>');
  process.exit(1);
}

function run({ projectName, frontendName, backendName, dbName }) {
  // Create the project in a NEW named folder inside cwd
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`\nError: Folder "${projectName}" already exists.\n`);
    process.exit(1);
  }

  console.log(`\nCreating project in: ${targetDir}\n`);

  // Copy template (package root) → new project folder
  copyDir(packageRoot, targetDir);

  console.log('Template copied. Applying names...\n');

  // Root package.json
  const rootPkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    rootPkg.name = projectName;
    // Remove publish-specific fields from the scaffolded copy
    delete rootPkg.bin;
    delete rootPkg.files;
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
    console.log(`✔ root/package.json        → "${projectName}"`);
  }

  // Frontend package.json
  const frontendPkgPath = path.join(targetDir, 'frontend', 'package.json');
  if (fs.existsSync(frontendPkgPath)) {
    const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf8'));
    frontendPkg.name = frontendName;
    fs.writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, 2) + '\n');
    console.log(`✔ frontend/package.json    → "${frontendName}"`);
  }

  // Backend package.json
  const backendPkgPath = path.join(targetDir, 'backend', 'package.json');
  if (fs.existsSync(backendPkgPath)) {
    const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
    backendPkg.name = backendName;
    fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2) + '\n');
    console.log(`✔ backend/package.json     → "${backendName}"`);
  }

  // Backend .env — update DB name
  const backendEnvPath = path.join(targetDir, 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    backendEnv = backendEnv.replace(
      /DATABASE_URL="postgresql:\/\/[^"]+"/,
      `DATABASE_URL="postgresql://postgres:Moh@9801@localhost:5432/${dbName}?schema=public"`
    );
    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log(`✔ backend/.env             → database "${dbName}"`);
  }

  console.log('\n=== Done! ===\n');
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm run install:all');
  console.log('  cd backend && npm run db:push && npm run db:seed');
  console.log('  npm run dev\n');
}