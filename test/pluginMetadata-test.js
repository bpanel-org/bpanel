import { expect } from 'chai';

import pluginMetadata from '../webapp/store/reducers/pluginMetadata';
import { ADD_PLUGIN_META } from '../webapp/store/constants/plugins';

describe('pluginMetadata reducer', () => {
  let state;
  beforeEach(() => {
    state = {
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
    };
  });

  describe('ADD_PLUGIN_META', () => {
    it('should throw error if plugin name already exists', () => {
      const action = {
        type: ADD_PLUGIN_META,
        payload: {
          name: 'dashboard'
        }
      };
      expect(() => {
        pluginMetadata(state, action);
      }).to.throw('already exists');
    });

    it('should add new plugin to store if not a duplicate', () => {
      const action = {
        type: ADD_PLUGIN_META,
        payload: {
          name: 'newPlugin'
        }
      };
      const newState = pluginMetadata(state, action);

      expect(Object.keys(newState)).to.have.length(
        Object.keys(state).length + 1
      );
      expect(newState[action.payload.name]).to.exist;
    });
  });
});
