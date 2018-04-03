import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Amount } from 'bcoin';
import { Input } from '@bpanel/bpanel-ui';

import { bwalletClient } from '@bpanel/bpanel-utils';
const walletClient = bwalletClient();

export default class SendForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      address: ''
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => {
      const newState = Object.assign({}, prevState);
      newState[name] = value;
      return newState;
    });
  }

  static get propTypes() {
    return {
      id: PropTypes.string
    };
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { id } = this.props;
    const { value, address } = this.state;
    const valInSatoshis = new Amount(value, 'btc');
    const outputs = [{ value: valInSatoshis.value, address }];

    try {
      walletClient.send(id, { value, outputs });
    } catch (e) {
      throw ('There was a problem sending the transaction: ', e.stack);
    }
  }

  render() {
    return (
      <form className="send-form" onSubmit={event => this.handleSubmit(event)}>
        <Input
          type="text"
          name="value"
          placeholder="Value"
          value={this.state.value}
          onChange={event => this.handleChange(event)}
        />
        <Input
          type="text"
          name="address"
          placeholder="Address"
          value={this.state.address}
          onChange={event => this.handleChange(event)}
        />
        <Input type="submit" name="submit">
          Send
        </Input>
      </form>
    );
  }
}
