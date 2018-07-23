import { expect, assert } from 'chai';
import sinon from 'sinon';

import {
  sortPluginMetadata,
  uniquePathNames
} from '../store/selectors/plugins';
import { plugins } from '@bpanel/bpanel-utils';

describe('plugin selectors', () => {
  let sortedPlugins, subItems, parentItems;

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
      },
      'special-plugin': {
        name: 'special-plugin',
        order: 0,
        parent: 'xwallets'
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

    sortedPlugins = sortPluginMetadata({ ...parentItems, ...subItems });
  });

  describe('sortPluginMetadata', () => {
    it('should return an array of all plugins, parents and children', () => {
      const totalPlugins =
        Object.keys(parentItems).length + Object.keys(subItems).length;
      expect(sortedPlugins).to.have.length(totalPlugins);
    });

    it('should call comparePlugins for sorting on parents and subItems', () => {
      const spy = sinon.spy(Array.prototype, 'sort');
      sortPluginMetadata({ ...parentItems, ...subItems });
      expect(spy.calledWith(plugins.comparePlugins)).to.be.true;
      const parentNames = Object.keys(parentItems).sort();
      expect(parentNames[0]).to.equal(sortedPlugins[0].name);
    });

    it('should only have two level hierarchy, no children w/ children', () => {
      const parents = new Set();
      sortedPlugins.forEach(plugin => {
        if (plugin.parent) parents.add(plugin.parent);
      });
      sortedPlugins.forEach(plugin => {
        if (plugin.parent)
          assert(
            !parents.has(plugin.name),
            `${plugin.name} has a parent and should not have children`
          );
      });
    });

    it('should add sorted subItems after parent', () => {
      // since parents and children are all on the same level in the array
      // in order to check children are in the right spot
      // we need to collect all chidlren first
      const subItems = new Map();
      sortedPlugins.forEach(plugin => {
        const { parent } = plugin;
        if (parent) {
          // if item has a parent, add it to the map, keyed by its parent
          if (subItems.has(parent)) {
            const children = subItems.get(parent);
            children.push(plugin);
            subItems.set(parent, children);
          } else {
            subItems.set(parent, [plugin]);
          }
        }
      });

      // when you find a parent, check that its children
      // follow it in the array
      sortedPlugins.forEach((plugin, index) => {
        // if we hit a plugin that is a key in our map
        // then the subsequent plugins in the array should match
        // the values in the map
        if (subItems.has(plugin.name)) {
          const children = subItems.get(plugin.name);
          let count = 0;
          while (count < children.length) {
            expect(sortedPlugins[index + count + 1]).to.deep.equal(
              children[count]
            );
            count++;
          }
        }
      });
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

      metadata.forEach(plugin => {
        assert(
          !paths.has(plugin.pathName),
          `Found duplicate pathName: ${plugin.pathName}`
        );
        paths.add(plugin.pathName);
      });
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
