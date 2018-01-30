import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Table } from 'bpanel-ui';

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
      leaveWallet: PropTypes.func,
      wallets: PropTypes.object
    };
  }

  render() {
    const { joinWallet, leaveWallet, wallets } = this.props;

    let walletTable;
    if (wallets[this.id] && wallets[this.id].transactions) {
      walletTable = <Table tableData={wallets[this.id].transactions} />;
    } else {
      walletTable = (
        <Text>No transaction data available for wallet {this.id}</Text>
      );
    }

    return (
      <div className="dashboard-container">
        <Header type="h2">Wallets</Header>
        <Button onClick={() => joinWallet(this.id, this.token)}>
          Join Wallet
        </Button>
        <Text>Must join wallet before subscribing to transactions</Text>
        <Button onClick={() => leaveWallet(this.id)}>Leave Wallet</Button>
        <Header type="h3">Wallet Transactions</Header>
        {walletTable}
      </div>
    );
  }
}
