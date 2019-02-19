// create webapp/version.json file
// Looks at the git tags and sha to output the version.

let commit, version;
const fs = require('fs');
const { execSync } = require('child_process');

try {
  commit = execSync('git rev-parse HEAD', { stdio: [] }).toString();
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Problem getting git commit:', e.message);
}
try {
  version = require('../package.json').version;
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Problem getting bPanel version:', e.message);
}

fs.writeFileSync('webapp/version.json', JSON.stringify({ commit, version }));
