import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Text } from '@bpanel/bpanel-ui';

export default class Wallet extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      id: PropTypes.string,
      balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      address: PropTypes.string
    };
  }

  render() {
    const { id, balance, address } = this.props;
    return (
      <div className="wallet-info">
        <Header type="h4">Wallet ID</Header>
        <Text type="p">{id}</Text>
        <Header type="h4">Balance</Header>
        <Text type="p">{balance}</Text>
        <Header type="h4">Address</Header>
        {(address && <Text type="p">{address}</Text>) || (
          <Text type="p">(Must join wallet for address)</Text>
        )}
      </div>
    );
  }
}
