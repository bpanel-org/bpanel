import { expect } from 'chai';

import { createUnique } from '../utils/helpers';

describe('helpers', () => {
  describe('createUnique', () => {
    it('should return a copy of the same name if already unique', () => {
      const names = new Set();
      const original = 'test';

      const name = createUnique(original, names);
      expect(name).to.equal(original);
    });

    it('should increment name if already exists', () => {
      const names = new Set();
      const original = 'test';
      names.add(original);
      const test = createUnique(original, names);
      names.add(test);
      expect(test).to.equal(`${original}-1`);

      const secondTest = createUnique(original, names);
      expect(secondTest).to.equal(`${original}-2`);
    });
  });
});
