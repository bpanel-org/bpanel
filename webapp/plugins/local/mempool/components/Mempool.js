/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';

import { Header, Button, widgetCreator } from '@bpanel/bpanel-ui';

class Mempool extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static get displayName() {
    return 'Mempool';
  }

  static get propTypes() {
    return {
      mempoolTx: PropTypes.number,
      mempoolSize: PropTypes.number
    };
  }

  justKidding() {
    alert('Just Kidding!'); // eslint-disable-line
  }

  render() {
    return (
      <div className="col-lg-4" key="mempool">
        <Header type="h5">Current Mempool</Header>
        <p>Mempool TX: {this.props.mempoolTx}</p>
        <p>Mempool Size: {this.props.mempoolSize}</p>
        <Button onClick={() => this.justKidding()}>
          Make Transactions Cheaper
        </Button>
      </div>
    );
  }
}

export default widgetCreator(Mempool);
