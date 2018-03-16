import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@bpanel/bpanel-ui';

import { bwalletClient } from '@bpanel/bpanel-utils';

const walletClient = bwalletClient();

export default class WalletForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      walletId: ''
    };
  }

  static get propTypes() {
    return {
      addWallet: PropTypes.func
    };
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { walletId } = this.state;
    const wallet = await walletClient.getInfo(walletId);
    window.sessionStorage.setItem('walletToken', wallet.token);
    window.sessionStorage.setItem('walletId', walletId);
    this.props.addWallet(wallet);
    this.setState({ walletId: '' });
  }

  handleChange(event) {
    this.setState({
      walletId: event.target.value
    });
  }

  render() {
    const { walletId } = this.state;
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <Input
          type="text"
          name="wallet-id"
          onChange={event => this.handleChange(event)}
          value={walletId}
          placeholder="Wallet ID"
        />
        <Input type="submit" name="submit">
          Submit
        </Input>
      </form>
    );
  }
}
