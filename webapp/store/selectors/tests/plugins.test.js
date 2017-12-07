import { expect } from 'chai';
import sinon from 'sinon';

import { sortPluginMetadata } from '../plugins';
import * as utils from '../../../utils/utils';

describe('sortPluginMetadata', () => {
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
        order: 1
      },
      wallets: {
        name: 'wallets',
        icon: 'hdd-o',
        order: 1
      },
      dashboard: {
        name: 'dashboard',
        order: 0,
        icon: 'home'
      }
    };

    actual = sortPluginMetadata({ ...parentItems, ...subItems });
  });

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

  it('should sort call comparePlugins for sorting on parents and subItems', () => {
    const spy = sinon.spy(utils, 'comparePlugins');
    sortPluginMetadata({ ...parentItems, ...subItems });
    expect(spy.called).to.be.true;
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
