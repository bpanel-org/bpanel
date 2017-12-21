import { expect } from 'chai';

import * as chainUtils from '../chain';
import fetchMock from 'fetch-mock';

describe('chainUtils', () => {
  describe('getBlock', () => {
    let blockHeight;
    let responseJson;

    beforeEach(() => {
      blockHeight = 123;
      responseJson = { foo: 'bar' };
      fetchMock.get(`/node/block/${blockHeight}`, responseJson);
    });

    afterEach(() => {
      fetchMock.restore();
    });

    it('should return response json', async () => {
      const block = await chainUtils.getBlock(blockHeight);
      expect(block).to.deep.equal(responseJson);
    });
  });

  describe('getBlocksInRange', () => {
    it('should throw if step is negative when counting up', () => {});

    it('should throw if step is positive when counting down', () => {});
  });
});
