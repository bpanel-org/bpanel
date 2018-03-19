import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Text } from '@bpanel/bpanel-ui';

export default class extends Component {
  constructor(props) {
    super(props);
  }

  static get displayName() {
    return 'Peers List';
  }

  static get propTypes() {
    return {
      peers: PropTypes.arrayOf(PropTypes.object)
    };
  }

  render() {
    const { peers } = this.props;

    let table;
    if (Array.isArray(peers) && peers.length) {
      // picking out peer data we want to display
      table = <Table tableData={peers} />;
    } else {
      table = <Text type="p">Loading peers...</Text>;
    }

    return <div className="peers-list">{table}</div>;
  }
}
