const fs = require('fs');
const path = require('path');
const semver = require('semver');
const minimist = require('minimist');  // Add this to parse command-line arguments
const packagePath = path.resolve(__dirname, 'package.json');
const packageJson = require(packagePath);
// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const versionType = args.type || 'patch';  // Default to 'patch' if --type is not provided
const newVersion = semver.inc(packageJson.version, versionType);
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
console.log(`Updated version to ${newVersion}`);