import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      recentBlocks: PropTypes.array,
      chainHeight: PropTypes.number,
      getRecentBlocks: PropTypes.func
    };
  }

  componentWillUpdate(nextProps) {
    const { chainHeight, getRecentBlocks } = this.props;
    // if chainHeight has increased, get the most recent blocks
    // getRecentBlocks is connected to the store and will update
    // the state with an array of `recentBlocks`
    if (nextProps.chainHeight > chainHeight) getRecentBlocks(9);
  }

  render() {
    const { recentBlocks, chainHeight } = this.props;
    return (
      <div className="dashboard-container">
        First... the chain height: {chainHeight}
        Then... some blocks:
        {recentBlocks &&
          recentBlocks.map(({ height, hash }) => (
            <p key={height}>
              Height of block: {height}, <br /> Hash: {hash}
            </p>
          ))}
      </div>
    );
  }
}
