// utils to keep api calls consistent
// by exporting current apis

export const get = {
  block: heightOrHash => `/node/block/${heightOrHash}`
};
