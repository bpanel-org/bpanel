// Looks at the git tags and sha to output the version.

let commit;
const fs = require('fs');
const { execSync } = require('child_process');
try {
  commit = execSync('git rev-parse HEAD').toString();
} catch (e) {}

fs.writeFileSync(
  'webapp/version.json',
  JSON.stringify({
    commit,
    version: require('../package.json').version
  })
);
