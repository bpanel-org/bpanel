import assert from 'assert';

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
export async function getBlocksInRange(start, end, step = 1) {
  // get all blocks from blockHeight `start` up to `start`+ n
  // create an array of the blocks
  const blocks = [];

  let height = start;
  if (start < end) {
    // counting up
    assert(step > 0, 'Step needs to be greater than zero to count up');
    while (height < end) {
      const block = await getBlock(height);
      blocks.push(block);
      height += step;
    }
  } else if (start > end) {
    // counting down
    let _step = step;
    if (step >= 1) {
      _step = -1;
    } else {
      assert(step < 1, 'Step must be negative to countdown');
    }
    while (height > end) {
      const block = await getBlock(height);
      blocks.push(block);
      height += _step;
    }
  }

  return blocks;
}

export default {
  getBlock,
  getBlocksInRange
};
