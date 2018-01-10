import React from 'react';
import HeaderRow from '../HeaderRow';

const exampleTableData = [
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

const colProps = Object.entries(exampleTableData[0]).map(keyValuePair => ({
  label: keyValuePair[0],
  dataKey: keyValuePair[0],
  width: 400,
  flexGrow: 1
}));

const HeaderRowRenderer = props => <HeaderRow {...props} />;

const tableProps = {
  colProps,
  headerHeight: 30,
  headerRowRenderer: HeaderRowRenderer,
  height: (exampleTableData.length + 1) * 30,
  onRowClick: ({ rowData }) => console.log(rowData), // eslint-disable-line no-console
  rowCount: exampleTableData.length,
  rowGetter: ({ index }) => exampleTableData[index],
  rowHeight: 30
};

export default tableProps;
