import { expect, assert } from 'chai';
import sinon from 'sinon';

import {
  sortPluginMetadata,
  uniquePathNames
} from '../store/selectors/plugins';
import { plugins } from '@bpanel/bpanel-utils';

describe('plugin selectors', () => {
  let actual, subItems, parentItems;

  beforeEach(() => {
    subItems = {
      'some wallet func': {
        name: 'some wallet func',
        order: 1,
        parent: 'wallets'
      },
      'first wallet func': {
        name: 'first wallet func',
        order: 0,
        parent: 'wallets'
      }
    };

    parentItems = {
      zwallets: {
        name: 'zwallets',
        icon: 'hdd-o',
        pathName: 'wallets',
        order: 1
      },
      wallets: {
        name: 'wallets',
        icon: 'hdd-o',
        pathName: 'wallets',
        order: 1
      },
      dashboard: {
        name: 'dashboard',
        order: 0,
        icon: 'home'
      },
      xwallets: {
        name: 'xwallets',
        icon: 'hdd-o',
        pathName: 'zwallets',
        order: 1
      }
    };

    actual = sortPluginMetadata({ ...parentItems, ...subItems });
  });

  describe('sortPluginMetadata', () => {
    it('should return an array of only parent plugin metadata objects', () => {
      const numberOfParents = Object.keys(parentItems).length;
      expect(actual).to.have.lengthOf(numberOfParents);

      let hasParents = false;
      for (let pluginMeta of actual) {
        hasParents = parentItems[pluginMeta.name] ? true : false;
        expect(hasParents, `"${pluginMeta.name}" not in parents object`).to.be
          .true;
      }
    });

    it('should call comparePlugins for sorting on parents and subItems', () => {
      const spy = sinon.spy(Array.prototype, 'sort');
      sortPluginMetadata({ ...parentItems, ...subItems });
      expect(spy.calledWith(plugins.comparePlugins)).to.be.true;
      const parentNames = Object.keys(parentItems).sort();
      expect(parentNames[0]).to.equal(actual[0].name);
    });

    it('should add subItems to subItem property of parents', () => {
      const subItemCount = {};
      // get number of expected subItems for each parent
      for (let plugin in subItems) {
        const parent = subItems[plugin].parent;
        let count = subItemCount[parent];
        subItemCount[parent] = count === undefined ? 1 : count + 1;
      }

      // confirm that each parent has expected number of subItems
      for (let plugin of actual) {
        if (subItemCount[plugin.name]) {
          expect(plugin.subItems).to.not.be.undefined;
          expect(plugin.subItems).to.have.lengthOf(subItemCount[plugin.name]);
        }
      }
    });
  });

  describe('uniquePathNames', () => {
    let metadata;

    beforeEach(() => {
      metadata = uniquePathNames(parentItems);
    });

    it('should return plugins in sorted order', () => {
      const sorted = sortPluginMetadata(parentItems);
      metadata.forEach((plugin, index) =>
        expect(plugin.name).to.equal(sorted[index].name)
      );
    });

    it('should not have any metadata w/ duplicate pathNames', () => {
      const paths = new Set();
      const duplicatePaths = new Set();
      metadata.forEach(plugin => paths.add(plugin.pathName));
      const sorted = sortPluginMetadata(parentItems);
      sorted.forEach(plugin => duplicatePaths.add(plugin.pathName));

      expect(duplicatePaths.size).to.not.equal(
        sorted.length,
        'Test data set does not have any duplicate pathNames. Fix data set'
      );
      expect(paths.size).to.equal(metadata.length);
    });

    it('should not have any name-pathName collisions between plugins', () => {
      const paths = metadata.map(plugin => plugin.pathName);
      const names = metadata.map(plugin => plugin.name);
      paths.forEach((path, i) =>
        names.forEach((name, j) => {
          if (path === name)
            assert(
              i === j,
              "plugin pathName should only collide with it's own name"
            );
        })
      );
    });
  });
});
