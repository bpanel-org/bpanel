import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Text, Table } from 'bpanel-ui';

import WalletForm from './WalletForm';
import Wallet from './Wallet';
import SendForm from './SendForm';

export default class Wallets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: window.sessionStorage.getItem('walletId'),
      token: window.sessionStorage.getItem('walletToken')
    };
  }

  static get propTypes() {
    return {
      addWallet: PropTypes.func,
      joinWallet: PropTypes.func,
      leaveWallet: PropTypes.func,
      wallets: PropTypes.object
    };
  }

  async handleJoin() {
    await this.setState({
      id: window.sessionStorage.getItem('walletId'),
      token: window.sessionStorage.getItem('walletToken')
    });

    if (this.state.id && this.state.token) {
      this.props.joinWallet(this.state.id, this.state.token);
    } else {
      alert('You must have the wallet token before joining a wallet!');
    }
  }

  handleLeave() {
    window.sessionStorage.removeItem('walletId');
    window.sessionStorage.removeItem('walletToken');
    this.props.leaveWallet(this.state.id);
    this.setState({
      id: '',
      token: ''
    });
  }

  render() {
    const { addWallet, wallets } = this.props;
    const { id } = this.state;

    let walletTable;
    if (wallets[id] && wallets[id].transactions) {
      walletTable = <Table tableData={wallets[id].transactions} />;
    } else {
      walletTable = <Text>No transaction data available for wallet {id}</Text>;
    }

    return (
      <div className="dashboard-container">
        <Header type="h2">Wallets</Header>
        <WalletForm addWallet={addWallet} />
        <div>
          <Text>Must join wallet before subscribing to transactions</Text>
        </div>
        <div>
          <Button onClick={() => this.handleJoin()}>Join Wallet</Button>
          <Button onClick={() => this.handleLeave()}>Leave Wallet</Button>
        </div>
        <Header type="h3">Wallets</Header>
        {Object.keys(wallets).map(id => (
          <Wallet
            id={id}
            balance={wallets[id].balance.confirmed}
            address={wallets[id].receiveAddress}
            key={id}
          />
        ))}
        <SendForm id={id} />
        <Header type="h3">Wallet Transactions</Header>
        {walletTable}
      </div>
    );
  }
}
