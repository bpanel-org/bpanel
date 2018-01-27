import React from 'react';
import PropTypes from 'prop-types';

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

const tableProps = {
  onRowClick: ({ rowData }) => console.log(rowData), // eslint-disable-line no-console
  tableData: exampleTableData
};

export default tableProps;
