const { execSync } = require('child_process');

module.exports = {
  clear
};

function clear() {
  execSync('npm install', {
    killSignal: 'SIGINT',
    stdio: [0, 1, 2],
    cwd: path.resolve(__dirname, '..')
  });
}
