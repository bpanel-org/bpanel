import { ADD_SIDE_NAV, REMOVE_SIDE_NAV } from '../constants/nav';

export function addSideNav(metadata) {
  return {
    type: ADD_SIDE_NAV,
    payload: { ...metadata, sidebar: true }
  };
}

export function removeSideNav(metadata) {
  return {
    type: REMOVE_SIDE_NAV,
    payload: metadata
  };
}
