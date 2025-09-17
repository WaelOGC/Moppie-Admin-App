#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing application caches...');

// Clear ESLint cache
const eslintCachePath = path.join(__dirname, 'node_modules', '.cache', '.eslintcache');
if (fs.existsSync(eslintCachePath)) {
  fs.unlinkSync(eslintCachePath);
  console.log('✅ ESLint cache cleared');
} else {
  console.log('ℹ️  ESLint cache not found');
}

// Clear entire .cache directory
const cacheDir = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ Node modules cache cleared');
} else {
  console.log('ℹ️  Node modules cache not found');
}

// Clear build directory
const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
  console.log('✅ Build directory cleared');
} else {
  console.log('ℹ️  Build directory not found');
}

console.log('🎉 Cache clearing complete!');
console.log('💡 You can now run: npm start');
