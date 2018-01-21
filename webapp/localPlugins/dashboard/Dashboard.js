import React, { Component } from 'react';
import PropTypes from 'prop-types';

const recentBlocksTable = recentBlocks =>
  recentBlocks.map(({ height, hash }, index) => (
    <p key={index}>
      Height of block: {height}, <br /> Hash: {hash}
    </p>
  ));

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
    if (chainHeight > 0) {
      this.callingRecentBlocks = true;
      getRecentBlocks(10);
    }
  }

  componentWillUnmount() {
    this.callingRecentBlocks = false;
  }

  // componentWillUpdate(nextProps) {
  //   const { chainHeight, recentBlocks = [], getRecentBlocks } = this.props;

  //   // if chainHeight has increased and recentBlocks is not set,
  //   // get the most recent blocks
  //   // both `addBlock` and `getRecentBlocks` are attached to the store
  //   // and will dispatch action creators to udpate the state
  //   if (
  //     nextProps.chainHeight &&
  //     nextProps.chainHeight >= chainHeight &&
  //     !recentBlocks.length &&
  //     !this.callingRecentBlocks
  //   ) {
  //     getRecentBlocks(10);
  //   }
  // }

  render() {
    const {
      recentBlocks,
      chainHeight,
      customChildrenBefore,
      customChildren
    } = this.props;

    let table;
    if (Array.isArray(recentBlocks) && recentBlocks.length) {
      table = recentBlocksTable(recentBlocks);
    } else {
      table = <p>Loading...</p>;
    }

    return (
      <div className="dashboard-container">
        {customChildrenBefore}
        First... the chain height: {chainHeight}
        Then... some blocks:
        {table}
        {customChildren}
      </div>
    );
  }
}
