// Looks at the git tags and sha to output the version.

const fs = require('fs');
const { execSync } = require('child_process');

fs.writeFileSync('webapp/version.json', JSON.stringify({
  commit:  execSync('git rev-parse HEAD').toString(),
  version: execSync('git describe --tags $(git rev-list --tags --max-count=1)').toString(),
}))

