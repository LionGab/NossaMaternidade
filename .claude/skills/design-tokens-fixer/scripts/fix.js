#!/usr/bin/env node
/**
 * Design Tokens Auto-Fixer Script
 * 
 * This script is called by Claude when using the Design Tokens Auto-Fixer skill.
 * It fixes hardcoded design values in React Native components.
 * 
 * Usage: node fix.js --file=path/to/file.tsx [--dry-run]
 */

// This script delegates to the main script in scripts/skills/
const path = require('path');
const { spawn } = require('child_process');

const mainScript = path.join(__dirname, '../../../../scripts/skills/design-tokens-fixer.js');
const args = process.argv.slice(2);

const child = spawn('node', [mainScript, ...args], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '../../../../'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (error) => {
  console.error('Error running design-tokens-fixer:', error);
  process.exit(1);
});

