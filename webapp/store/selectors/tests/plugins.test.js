const pluginMeta = {
  dashboard: {
    name: 'dashboard',
    order: 0,
    icon: 'home'
  },
  wallets: {
    name: 'wallets',
    icon: 'hdd-o',
    order: 1
  },
  'wome wallet func': {
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
