import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RecentBlocks from './RecentBlocks';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      blocks: PropTypes.array,
      chainHeight: PropTypes.number
    };
  }

  render() {
    const { blocks, chainHeight } = this.props;
    return (
      <div className="dashboard-container">
        First... the chain height: {chainHeight}
        <RecentBlocks blocks={blocks} />
      </div>
    );
  }
}
