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
      address: 'RBhL5fhNSnm1KA2XBzjh1Aamxyqs6vshjr',
      outputs: [
        {
          value: 10000,
          address: 'RBhL5fhNSnm1KA2XBzjh1Aamxyqs6vshjr',
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
