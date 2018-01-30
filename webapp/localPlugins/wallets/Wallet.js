import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { components } from 'bpanel-ui';

const { Button, Header, Text } = components;

export default class Wallets extends PureComponent {
  constructor(props) {
    super(props);
    this.id = 'primary';
    this.token =
      '5c0dac3bc6a1177b03fae8d97ff53b6f838ff8e3954783959c10ee20b3f71a01';
  }

  static get propTypes() {
    return {
      joinWallet: PropTypes.func,
      leaveWallet: PropTypes.func
    };
  }

  render() {
    const { joinWallet, leaveWallet } = this.props;
    return (
      <div className="dashboard-container">
        <Header type="h2">Wallets</Header>
        <Button onClick={() => joinWallet(this.id, this.token)}>
          Join Wallet
        </Button>
        <Text>Must join wallet before subscribing to transactions</Text>
        <Button onClick={() => leaveWallet(this.id)}>Leave Wallet</Button>
        <Header type="h3">Wallet Transactions</Header>
      </div>
    );
  }
}
