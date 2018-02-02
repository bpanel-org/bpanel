// utils to keep api calls consistent
// by exporting current api

export const get = {
  block: heightOrHash => `/node/block/${heightOrHash}`,
  info: () => '/node',
  wallet: id => `/node/wallet/${id}`,
  accounts: id => `node/wallet/${id}/account`,
  account: (wallet = 'primary', account = 'default') =>
    `/node/wallet/${wallet}/account/${account}`
};

export const post = {
  tx: (id = 'primary') => `/node/wallet/${id}/send`
};

export default { get, post };
