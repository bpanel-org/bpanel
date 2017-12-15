// Simple API call to retrieve a block at specified height or hash
// returns a promise
export function getBlock(hashOrHeight) {
  return fetch(`/node/block/${hashOrHeight}`)
    .then(response => response.json())
    .catch(
      err => console.error('Error retrieving block: ', err) // eslint-disable-line no-console
    );
}

// utility to get a range of blocks
export function getBlocksInRange(start, n = 10, step = 1) {
  // get all blocks from blockHeight `start` up to `start`+ n
  // create an array of the block heights we will retrieve
  const blockHeights = Array(n / step)
    .fill(start)
    .map((height, index) => getBlock(height + index * step));

  return Promise.all(blockHeights);
}

export default {
  getBlock,
  getBlocksInRange
};
