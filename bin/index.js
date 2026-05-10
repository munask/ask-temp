#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// Check if interactive or args mode
if (args.length >= 4) {
  // Non-interactive mode: projectName frontendName backendName dbName
  const [projectName, frontendName, backendName, dbName] = args;
  initialize({ projectName, frontendName, backendName, dbName });
} else if (args.length === 0) {
  // Interactive mode
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

  async function main() {
    console.log('\n=== Project Initialization ===\n');

    const projectName = await question('Project name (e.g., my-project): ');
    const frontendName = await question('Frontend name (e.g., my-frontend): ');
    const backendName = await question('Backend name (e.g., my-backend): ');
    const dbName = await question('Database name (e.g., mydb): ');

    rl.close();

    initialize({ projectName, frontendName, backendName, dbName });
  }

  main();
} else {
  console.error('Usage: npx ask-temp <project-name> <frontend-name> <backend-name> <db-name>');
  console.error('   or: npx ask-temp (interactive mode)');
  process.exit(1);
}

function initialize({ projectName, frontendName, backendName, dbName }) {
  const rootDir = process.cwd();

  // Update root package.json name
  const rootPkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(rootPkgPath)) {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
    rootPkg.name = projectName;
    fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
    console.log(`Updated root package.json: name = "${projectName}"`);
  }

  // Update frontend package.json name
  const frontendPkgPath = path.join(rootDir, 'frontend', 'package.json');
  if (fs.existsSync(frontendPkgPath)) {
    const frontendPkg = JSON.parse(fs.readFileSync(frontendPkgPath, 'utf8'));
    frontendPkg.name = frontendName;
    fs.writeFileSync(frontendPkgPath, JSON.stringify(frontendPkg, null, 2) + '\n');
    console.log(`Updated frontend/package.json: name = "${frontendName}"`);
  }

  // Update backend package.json name
  const backendPkgPath = path.join(rootDir, 'backend', 'package.json');
  if (fs.existsSync(backendPkgPath)) {
    const backendPkg = JSON.parse(fs.readFileSync(backendPkgPath, 'utf8'));
    backendPkg.name = backendName;
    fs.writeFileSync(backendPkgPath, JSON.stringify(backendPkg, null, 2) + '\n');
    console.log(`Updated backend/package.json: name = "${backendName}"`);
  }

  // Update backend .env DATABASE_URL
  const backendEnvPath = path.join(rootDir, 'backend', '.env');
  if (fs.existsSync(backendEnvPath)) {
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    backendEnv = backendEnv.replace(
      /DATABASE_URL="postgresql:\/\/postgres:[^@]+@[^/]+\/([^?]+)\?/,
      `DATABASE_URL="postgresql://postgres:Moh@9801@localhost:5432/${dbName}?"`
    );
    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log(`Updated backend/.env: database name = "${dbName}"`);
  }

  console.log('\n=== Initialization Complete! ===\n');
}
