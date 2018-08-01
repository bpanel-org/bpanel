import assert from 'assert';
import { helpers } from '@bpanel/bpanel-utils';
import { ADD_SIDE_NAV, REMOVE_SIDE_NAV, SET_SIDE_NAV } from '../constants/nav';
import { sortedNavItems } from '../selectors/nav';

export function addSideNav(metadata) {
  assert(metadata.name, 'nav items must include a name');
  const { pathName, name } = metadata;
  // get hash for unique id
  const hash = helpers.getHash(metadata);
  const id = hash.slice(0, 6);
  metadata.pathName = pathName ? pathName : name;
  return {
    type: ADD_SIDE_NAV,
    payload: { ...metadata, sidebar: true, id }
  };
}

export function setSideNav(sideNav) {
  return {
    type: SET_SIDE_NAV,
    payload: sideNav
  };
}

export function loadSideNav() {
  return (dispatch, getState) => {
    const currentSideNav = getState().nav.sidebar;
    // only load if there isn't already a sidebar nav
    if (currentSideNav.length) return;

    const pluginMetadata = getState().pluginMetadata;
    let sideNav = sortedNavItems({ pluginMetadata });
    // add unique id to each nav item
    sideNav = sideNav.map(item => {
      item.id = item.id ? item.id : helpers.getHash(item).slice(0, 6);
      return item;
    });
    dispatch(setSideNav(sideNav));
  };
}

export function removeSideNav(metadata) {
  if (!metadata.id || !metadata.name)
    // eslint-disable-next-line no-console
    console.warn('Must pass an id or name to delete nav item');
  return {
    type: REMOVE_SIDE_NAV,
    payload: metadata
  };
}

export default {
  addSideNav,
  setSideNav,
  removeSideNav,
  loadSideNav
};
