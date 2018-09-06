const { URL } = require('url');
const brq = require('brq');

async function npmExists(_packageName) {
  const packageName = _packageName.toString();
  const base = 'https://www.npmjs.org/package/';
  const { href: path } = new URL(packageName, base);
  const response = await brq({ url: path, method: 'HEAD' });
  if (200 <= response.statusCode < 400) return true;
  return false;
}

module.exports = npmExists;
