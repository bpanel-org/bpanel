// utils to keep api calls consistent
// by exporting current api

export const get = {
  block: heightOrHash => `/node/block/${heightOrHash}`,
  info: () => '/node'
};

export default { get };
