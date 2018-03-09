import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Table } from '@bpanel/bpanel-ui';

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
      customChildrenBefore: PropTypes.node,
      customChildren: PropTypes.node,
      recentBlocks: PropTypes.array,
      getRecentBlocks: PropTypes.func,
      addBlock: PropTypes.func
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

  componentWillUpdate(nextProps) {
    const { chainHeight, recentBlocks = [], getRecentBlocks } = this.props;

    // if chainHeight has increased and recentBlocks is not set,
    // get the most recent blocks
    // `getRecentBlocks` are attached to the store
    // and will dispatch action creators to udpate the state
    if (
      nextProps.chainHeight &&
      nextProps.chainHeight >= chainHeight &&
      !recentBlocks.length &&
      !this.callingRecentBlocks
    ) {
      getRecentBlocks(10);
      this.callingRecentBlocks = true;
    }
  }

  render() {
    const {
      recentBlocks,
      chainHeight,
      customChildrenBefore,
      customChildren
    } = this.props;

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

    return (
      <div className="dashboard-container">
        {customChildrenBefore}
        <Header type="h4">Chain height: {chainHeight}</Header>
        <Button onClick={() => this.props.getRecentBlocks(10)}>
          Get Blocks
        </Button>
        {table}
        {customChildren}
      </div>
    );
  }
}
