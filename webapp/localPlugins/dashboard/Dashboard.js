import React from 'react';
const UX = require('bpanel-ux');

const { components: { Header, Link, Button, Text, Table } } = UX;

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
    <Header type="h1">Recent Blocks</Header>
    <Link to="/wallets">Link Component.</Link>
    <br />
    <Text>Text Component</Text>
    <br />
    <Button>Button Component</Button>
    <br />
    <Table {...tableProps} />
  </div>
);

export default Dashboard;
