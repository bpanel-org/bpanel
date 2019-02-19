import { expect, assert } from 'chai';
import sinon from 'sinon';
import { plugins } from '@bpanel/bpanel-utils';

import {
  sortPluginMetadata,
  getNavItems,
  getNestedPaths
} from '../store/selectors/nav';

describe('plugin selectors', () => {
  let sortedPlugins, subItems, parentItems, metadataList;

  beforeEach(() => {
    subItems = {
      'some wallet func': {
        name: 'some wallet func',
        order: 1,
        nav: true,
        parent: 'wallets'
      },
      'first wallet func': {
        name: 'first wallet func',
        order: 0,
        sidebar: true,
        parent: 'wallets'
      },
      'special-plugin': {
        name: 'special-plugin',
        order: 0,
        nav: true,
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
        nav: true,
        order: 1
      },
      dashboard: {
        name: 'dashboard',
        order: 0,
        nav: true,
        icon: 'home'
      },
      xwallets: {
        name: 'xwallets',
        icon: 'hdd-o',
        sidebar: true,
        displayName: 'zwallets',
        pathName: 'zwallets',
        order: 1
      }
    };

    metadataList = Object.values({ ...parentItems, ...subItems });
    sortedPlugins = sortPluginMetadata(metadataList);
  });

  describe('sortPluginMetadata', () => {
    it('should return an array of all plugins, parents and children', () => {
      const totalPlugins =
        Object.keys(parentItems).length + Object.keys(subItems).length;
      expect(sortedPlugins).to.have.length(totalPlugins);
    });

    it('should call comparePlugins for sorting on parents and subItems', () => {
      const spy = sinon.spy(Array.prototype, 'sort');
      sortPluginMetadata(metadataList);
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

  describe('getNavItems', () => {
    it('should only have items with sidebar or nav properties set to true', () => {
      const navItems = getNavItems(sortedPlugins);
      assert(navItems.length, 'Data set did not return any nav items');
      navItems.forEach(item =>
        assert(
          item.sidebar || item.nav,
          `${item.name} does not have nav or sidebar property set to true`
        )
      );
    });
  });

  describe('getNestedPaths', () => {
    it('should update child pathNames to be nested if has a parent', () => {
      const metadata = getNavItems(sortedPlugins);
      const nested = getNestedPaths(metadata);
      nested.forEach(plugin => {
        if (plugin.parent) {
          const parentIndex = metadata.findIndex(
            item => item.name === plugin.parent
          );

          const parent = metadata[parentIndex];
          const parentPath = parent.pathName ? parent.pathName : parent.name;

          expect(
            plugin.pathName === `${parentPath}/${plugin.pathName}`,
            `${plugin.name} did not nest its path in its parent correctly`
          );
        }
      });
    });
  });
});
