import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { utils } from '@bpanel/bpanel-ui';

const { connectTheme } = utils;

const cache = new CellMeasurerCache({
  defaultWidth: 600,
  minWidth: 100,
  fixedHeight: true
});

class ExpandedRow extends PureComponent {
  static get propTypes() {
    return {
      colProps: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          dataKey: PropTypes.string,
          width: PropTypes.number
        })
      ),
      expandedData: PropTypes.shape({
        hash: PropTypes.string,
        prevBlock: PropTypes.string,
        merkleRoot: PropTypes.string,
        bits: PropTypes.number,
        nonce: PropTypes.number
      }),
      theme: PropTypes.object
    };
  }

  static get defaultProps() {
    return {
      style: {
        bodyStyle: {},
        containerStyle: {},
        headerStyle: {}
      }
    };
  }

  formatExpandedData() {
    const { expandedData } = this.props;
    const { hash, prevBlock, merkleRoot, bits, nonce } = expandedData;
    return {
      mainData: [
        { name: 'hash', value: hash },
        { name: 'prevBlock', value: prevBlock },
        { name: 'merkleRoot', value: merkleRoot }
      ],
      subData: [{ name: 'bits', value: bits }, { name: 'nonce', value: nonce }]
    };
  }

  cellRenderer({ columnIndex, key, parent, rowIndex, style }, gridData) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <div
          key={key}
          style={{
            ...style,
            border:
              columnIndex === 1 ? '1px solid rgba(255, 255, 255, 0.2)' : null,
            padding: '5px'
          }}
        >
          {gridData[rowIndex][columnIndex]}
        </div>
      </CellMeasurer>
    );
  }

  /*
   ** onCopy: Copies data inside of the respective data field.
   */

  onCopy(i) {
    const data = this[`dataCol${i}`];
    const textField = document.createElement('textarea');
    textField.innerText = data.innerText;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  render() {
    const { theme } = this.props;
    const { mainData, subData } = this.formatExpandedData();
    return (
      <div className={theme.expandedRow.container}>
        {/* Main Data */}
        <div className={theme.expandedRow.mainDataContainer}>
          {mainData.map((data, i) => (
            <div className={theme.expandedRow.dataRow} key={data.name}>
              <div className={theme.expandedRow.rowHeader}>{data.name}</div>
              <div
                className={theme.expandedRow.borderedCol}
                ref={dataCol => (this[`dataCol${i}`] = dataCol)}
              >
                {data.value}
              </div>
              <i
                className={`fa fa-copy ${theme.expandedRow.copyIcon}`}
                onClick={() => this.onCopy(i)}
              />
            </div>
          ))}
        </div>
        {/* Sub Data */}
        <div className={theme.expandedRow.subDataContainer}>
          {subData.map(data => (
            <div className={theme.expandedRow.dataRow} key={data.name}>
              <div className={theme.expandedRow.rowHeader}>{data.name}</div>
              <div className={theme.expandedRow.borderedCol}>{data.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default connectTheme(ExpandedRow);
