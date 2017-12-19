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
  }

  static get propTypes() {
    return {
      recentBlocks: PropTypes.array,
      chainHeight: PropTypes.number,
      getRecentBlocks: PropTypes.func,
      addBlock: PropTypes.func
    };
  }

  componentDidMount() {
    const { chainHeight, getRecentBlocks } = this.props;
    if (chainHeight > 0) {
      getRecentBlocks(9);
    }
  }

  componentWillUpdate(nextProps) {
    const { chainHeight, recentBlocks = [], getRecentBlocks } = this.props;

    // if chainHeight has increased, get the most recent blocks
    // both `addBlock` and `getRecentBlocks` are attached to the store
    // and will dispatch action creators to udpate the state
    if (
      nextProps.chainHeight &&
      nextProps.chainHeight >= chainHeight &&
      !recentBlocks.length
    ) {
      getRecentBlocks(9);
    }
  }

  render() {
    const { recentBlocks, chainHeight } = this.props;
    let table;
    if (Array.isArray(recentBlocks) && recentBlocks.length) {
      table = recentBlocksTable(recentBlocks);
    } else {
      table = <p>Loading...</p>;
    }
    return (
      <div className="dashboard-container">
        First... the chain height: {chainHeight}
        Then... some blocks:
        {table}
      </div>
    );
  }
}
