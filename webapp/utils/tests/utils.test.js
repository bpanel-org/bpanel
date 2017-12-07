import { expect } from 'chai';

import { comparePlugins } from '../utils';

describe('comparePlugins', () => {
  let plugins, sortedPlugins;
  beforeEach(() => {
    plugins = [
      {
        name: 'zwallets',
        icon: 'hdd-o',
        order: 1
      },
      {
        name: 'wallets',
        icon: 'hdd-o',
        order: 1
      },
      {
        name: 'dashboard',
        order: 0,
        icon: 'home'
      }
    ];
    sortedPlugins = plugins.sort(comparePlugins);
  });

  it('should arrange by order first', () => {
    sortedPlugins.map(plugin => plugin.order).reduce((acc, order) => {
      expect(order).to.be.at.least(acc);
      return order;
    }, 0);
  });

  it('should sort by name if order is the same', () => {
    sortedPlugins.reduce((acc, plugin) => {
      if (acc.order === plugin.order) {
        expect(acc.name.localeCompare(plugin.name)).to.be.at.most(0);
      }
      return plugin;
    }, sortedPlugins[0]);
  });
});
