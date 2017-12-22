// sort plugins given their metadata
// first sorts by order property then name
export const comparePlugins = (pluginA, pluginB) => {
  // first sort by order, if order is same then order by name
  if (pluginA.order > pluginB.order) {
    return 1;
  } else if (pluginA.order < pluginB.order) {
    return -1;
  } else if (pluginA.name > pluginB.name) {
    return 1;
  } else if (pluginA.name < pluginB.name) {
    return -1;
  } else {
    return 0;
  }
};

export default { comparePlugins };
