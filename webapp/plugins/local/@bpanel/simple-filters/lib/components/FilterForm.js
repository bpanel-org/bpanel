import React from 'react';
import { bpanelClient } from '@bpanel/bpanel-utils';
import { Text } from '@bpanel/bpanel-ui';

export default class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hash: '',
      filter: ''
    };
    this.client = bpanelClient();
  }

  static get displayName() {
    return 'Filters Form';
  }

  onChange(e) {
    e.preventDefault();
    this.setState({ hash: e.target.value });
    if (e.target.value.length !== 64) {
      e.target.setCustomValidity(
        'Not valid block hash. Must be 256 bits (64 chars)'
      );
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    const { hash } = this.state;
    const filter = await this.client.execute('getcfilter', [hash, 0]);
    this.setState({ filter });
  }

  render() {
    const { hash, filter } = this.state;

    return (
      <div className="col-4">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            className="form-control"
            type="text"
            value={hash}
            placeholder="Block Hash"
            onChange={e => this.onChange(e)}
            required
            minLength="64"
            maxLength="64"
          />
          <input type="submit" name="submit" className="form-control" />
        </form>
        {filter && <Text>Filter: {filter}</Text>}
      </div>
    );
  }
}
