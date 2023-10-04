#!/usr/bin/env node

const { execSync } = require('child_process');
const { join } = require('path');
const fs = require('fs');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
};

const repoName = process.argv[2];

if (!repoName) {
  console.error('Usage: npx your-package-name <repo-name>');
  process.exit(1);
}

const templateRepoURL = 'https://github.com/phxlab/phx-svelte';
const gitCheckoutCommand = `git clone --depth 1 ${templateRepoURL} ${repoName}`;
const installDepsCommand = `cd ${repoName} && bun install`;

console.log(`Cloning the template into ${repoName}`);

const checkedOut = runCommand(gitCheckoutCommand);

if (!checkedOut) {
  process.exit(1);
}

console.log(`Installing dependencies with bun`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
  process.exit(1);
}

// Remove the .git folder to remove the history
const gitFolder = join(repoName, '.git');
if (fs.existsSync(gitFolder)) {
  fs.rmSync(gitFolder, { recursive: true });
}

// Initialize a new Git repository
const initGitCommand = `cd ${repoName} && git init`;
runCommand(initGitCommand);

console.log('Success!');
console.log(`cd ${repoName} && bun run dev`);
