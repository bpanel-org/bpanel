import { expect } from 'chai';
import pluginMetadata from '../pluginMetadata';
import { ADD_PLUGIN } from '../constants';

describe('pluginMetadata reducer', () => {
  let state;
  beforeEach(() => {
    state = {
      pluginMetadata: {
        dashboard: {
          name: 'dashboard',
          order: 0
        },
        wallets: {
          name: 'wallets',
          order: 1
        },
        testWallet: {
          name: 'testWallet',
          order: 0
        }
      }
    };
  });

  describe('ADD_PLUGIN', () => {
    it('should throw error if plugin name already exists', () => {
      const action = pluginmetadata(state);
    });
  });
});
