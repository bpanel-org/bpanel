import { getClient, chain as chainUtils } from '@bpanel/bpanel-utils';

const client = getClient('_docker');
const height = (144 * 3) + 20;
console.log('client:', client);

(async () => {
  const testBlock = await client.node.getBlock(350);
  console.log('getBlock:', testBlock);

  const testBlockRPC = await client.node.execute('getblock', [testBlock.hash, true, true]);
  console.log('RPC:', testBlockRPC);
})();

const app = document.getElementById('app');
const listDiv = document.createElement('div');
const blockDiv = document.createElement('div');
const txDiv = document.createElement('div');
listDiv.setAttribute("id", "list");
blockDiv.setAttribute("id", "block");
blockDiv.style.whiteSpace = 'pre';
blockDiv.style.borderTop = '1px solid black';
txDiv.setAttribute("id", "tx");
txDiv.style.whiteSpace = 'pre';
txDiv.style.borderTop = '1px solid black';
app.appendChild(listDiv);
app.appendChild(blockDiv);
app.appendChild(txDiv);

async function getRecentBlocks(n = 10) {
  const { getBlocksInRange } = chainUtils;
  let count = n;
  // if we have fewer blocks then the range we want to retrieve
  // then only retrieve up to height
  if (height <= n) {
    count = height;
  }
  try {
    const blocks = await getBlocksInRange(
      height,
      height - count,
      -1,
      getClient().isSPV
    );
    return blocks
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Could not retrieve blocks:', e);
    return [];
  }
}

const showBlock = async function (hash) {
  const { getBlock } = chainUtils;
  const block = await getBlock(hash);
  blockDiv.innerHTML = JSON.stringify(block, null, 2);
}
window.showBlock = showBlock;

(async () => {
  const blocks = await getRecentBlocks(10);
  let blocksList = '<h3>Recent Blocks:</h3><br>';
  for (const block of blocks) {
    const blockHash = block.hash;
    const blockHeight = block.height;
    blocksList += `${blockHeight}: <a onclick='showBlock("${blockHash}");'>${blockHash}</a><br>`;
  }
  listDiv.innerHTML = blocksList;
})();

