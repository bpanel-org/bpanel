import { ADD_SIDE_NAV, REMOVE_SIDE_NAV } from '../constants/nav';
import assert from 'assert';

export function addSideNav(metadata) {
  assert(metadata.name, 'nav items must include a name');
  const { pathName, name } = metadata;
  metadata.pathName = pathName ? pathName : name;
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
