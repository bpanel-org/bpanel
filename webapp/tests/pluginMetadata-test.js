import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import pluginMetadata from '../store/reducers/pluginMetadata';
import { ADD_PLUGIN } from '../store/constants/plugins';

describe('pluginMetadata reducer', () => {
  let state;
  beforeEach(() => {
    state = Immutable({
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
    });
  });

  describe('ADD_PLUGIN', () => {
    it('should throw error if plugin name already exists', () => {
      const action = {
        type: ADD_PLUGIN,
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
        type: ADD_PLUGIN,
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
