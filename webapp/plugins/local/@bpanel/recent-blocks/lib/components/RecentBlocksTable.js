import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from '@bpanel/bpanel-ui';

import ExpandedRow from './ExpandedRow';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    // only want to do the recent block call once on mount
    // or on update when route changes
    // for other new blocks, we use the socket
    this.callingRecentBlocks = false;
  }

  static get propTypes() {
    return {
      chainHeight: PropTypes.number,
      recentBlocks: PropTypes.array,
      getRecentBlocks: PropTypes.func
    };
  }

  componentDidMount() {
    const { chainHeight, getRecentBlocks } = this.props;
    if (chainHeight > 0 && !this.callingRecentBlocks) {
      this.callingRecentBlocks = true;
      getRecentBlocks(10);
    }
  }

  componentWillUnmount() {
    this.callingRecentBlocks = false;
  }

  componentDidUpdate(prevProps) {
    const { chainHeight, recentBlocks = [], getRecentBlocks } = this.props;

    // if chainHeight has increased and recentBlocks is not set,
    // get the most recent blocks
    // `getRecentBlocks` are attached to the store
    // and will dispatch action creators to udpate the state
    if (
      prevProps.chainHeight &&
      prevProps.chainHeight >= chainHeight &&
      !recentBlocks.length &&
      !this.callingRecentBlocks
    ) {
      getRecentBlocks(10);
      this.callingRecentBlocks = true;
    }
  }

  render() {
    const { recentBlocks } = this.props;

    let table;
    if (Array.isArray(recentBlocks) && recentBlocks.length) {
      table = (
        <Table
          ExpandedComponent={ExpandedRow}
          expandedHeight={240}
          tableData={recentBlocks}
        />
      );
    } else {
      table = <p>Loading...</p>;
    }

    return <div className="recent-blocks">{table}</div>;
  }
}
