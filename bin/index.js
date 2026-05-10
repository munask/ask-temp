#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);
let targetDir = args[0] || process.cwd();

// Allow relative paths and resolve
if (!path.isAbsolute(targetDir)) {
  targetDir = path.resolve(process.cwd(), targetDir);
}

// Verify it's a valid project directory
const packageJsonPath = path.join(targetDir, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: No package.json found in "${targetDir}"`);
  console.error('Please ensure you are in a valid project directory.');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('\n=== Project Initialization ===\n');
  console.log(`Target directory: ${targetDir}\n`);

  const projectName = await question('Project name (e.g., my-project): ');
  const frontendName = await question('Frontend name (e.g., my-frontend): ');
  const backendName = await question('Backend name (e.g., my-backend): ');
  const dbName = await question('Database name (e.g., mydb): ');

  rl.close();

  const rootDir = targetDir;

  // Update root package.json name
  const rootPkgPath = path.join(rootDir, 'package.json');
  const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
  rootPkg.name = projectName;
  fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
  console.log(`Updated root package.json: name = "${projectName}"`);

  // Update frontend package.json name
  const frontendPkgPath = path.join(rootDir, 'frontend', 'package.json');
  const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf8'));
  frontendPkg.name = frontendName;
  fs.writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, 2) + '\n');
  console.log(`Updated frontend/package.json: name = "${frontendName}"`);

  // Update backend package.json name
  const backendPkgPath = path.join(rootDir, 'backend', 'package.json');
  const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
  backendPkg.name = backendName;
  fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2) + '\n');
  console.log(`Updated backend/package.json: name = "${backendName}"`);

  // Update backend .env DATABASE_URL
  const backendEnvPath = path.join(rootDir, 'backend', '.env');
  let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  backendEnv = backendEnv.replace(
    /DATABASE_URL="postgresql:\/\/postgres:[^@]+@[^/]+\/([^?]+)\?/,
    `DATABASE_URL="postgresql://postgres:Moh@9801@localhost:5432/${dbName}?`
  );
  fs.writeFileSync(backendEnvPath, backendEnv);
  console.log(`Updated backend/.env: database name = "${dbName}"`);

  console.log('\n=== Initialization Complete! ===\n');
  console.log('Run the following to get started:\n');
  console.log(`  npm run install:all`);
  console.log(`  npm run dev\n`);
}

main();
