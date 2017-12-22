import React from 'react';
const UI = require('bpanel-ui');

const { components: { Header, Link, Button, Text, Table } } = UI;

const list = [
  {
    Height: '488236',
    Age: '2m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  },
  {
    Height: '488236',
    Age: '14m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  },
  {
    Height: '488236',
    Age: '2m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  },
  {
    Height: '488236',
    Age: '14m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  },
  {
    Height: '488236',
    Age: '2m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  },
  {
    Height: '488236',
    Age: '14m',
    '# of Tx': '2464',
    'BTC Sent': '18',
    'Size (kB)': '1,018',
    Weight: '1898',
    'Avg Fee': '$1.58',
    Miner: 'bcoin'
  }
];

const headerRowRenderer = ({ columns, ...rest }) => (
  <div role="row" {...rest}>
    {columns}
  </div>
);

const colProps = Object.entries(list[0]).map(keyValuePair => ({
  label: keyValuePair[0],
  dataKey: keyValuePair[0],
  width: 200,
  flexGrow: 1
}));

const tableProps = {
  height: (list.length + 1) * 30,
  headerHeight: 30,
  headerRowRenderer,
  onRowClick: ({ rowData }) => {
    console.log(rowData);
  },
  rowHeight: 30,
  rowCount: list.length,
  rowGetter: ({ index }) => list[index],
  colProps
};

const Dashboard = () => (
  <div>
    <Header type="h1">H1 tag</Header>
    <Header type="h2">H2 tag</Header>
    <Header type="h3">H3 tag</Header>
    <Header type="h4">H4 tag</Header>
    <Header type="h5">H5 tag</Header>
    <Header type="h6">H6 tag</Header>
    <Text>Text default Component</Text>
    <br />
    <Text type="p">Text p tag Component</Text>
    <Text type="strong">Text strong tag Component</Text>
    <br />
    <Link to="/wallets">Link Component.</Link>
    <br />
    <Link to="http://bcoin.io/">External Link to Bcoin.</Link>
    <br />
    <Button>Button Component</Button>
    <br />
    <Table {...tableProps} />
  </div>
);

export default Dashboard;
