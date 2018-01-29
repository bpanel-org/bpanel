const { WalletClient } = require('bclient');

(async () => {
  const walletClient = new WalletClient({
    apiKey: 'my-sweet-key',
    network: 'regtest',
    id: 'primary',
    port: 48334
  });
  await walletClient.open();
  try {
    const response = await walletClient.send('primary', {
      value: 1,
      address: 'RYUzPesXk4vNtnscwCBPrR3netCcvEuAaT',
      outputs: [
        {
          value: 10000,
          address: 'RYUzPesXk4vNtnscwCBPrR3netCcvEuAaT',
          account: 'default'
        }
      ]
    });
    console.log(response);
  } catch (error) {
    console.log('error: ', error);
  }
  walletClient.close();
})();
