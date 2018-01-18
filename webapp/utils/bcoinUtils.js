const bcoin = require('bcoin');
const { BufferReader, util } = bcoin.utils;
const { BlockMeta } = bcoin.wallet.records;
const Headers = bcoin.headers;

function parseEntry(data) {
  if (typeof data === 'string') data = Buffer.from(data, 'hex');

  const block = Headers.fromHead(data);
  const br = new BufferReader(data);
  br.seek(80);

  const height = br.readU32();
  const hash = block.hash('hex');

  return new BlockMeta(hash, height, block.time);
}

function calcProgress(start, tip) {
  const current = tip - start;
  const end = util.now() - start - 40 * 60;
  return Math.min(1, current / end);
}

export default {
  calcProgress,
  parseEntry
};
