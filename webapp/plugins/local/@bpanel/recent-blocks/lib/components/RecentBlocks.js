import React from 'react';
import PropTypes from 'prop-types';
import { Header, Button, widgetCreator } from '@bpanel/bpanel-ui';

import RecentBlocksTable from './RecentBlocksTable';

class RecentBlocks extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static get displayName() {
    return 'Recent Blocks Widget';
  }

  static get propTypes() {
    return {
      chainHeight: PropTypes.number,
      recentBlocks: PropTypes.array,
      getRecentBlocks: PropTypes.func
    };
  }

  render() {
    const { getRecentBlocks } = this.props;
    return (
      <div className="col">
        <Header type="h3">Recent Blocks</Header>
        <RecentBlocksTable {...this.props} />
        <Button onClick={() => getRecentBlocks(10)}>Get Blocks</Button>
      </div>
    );
  }
}

export default widgetCreator(RecentBlocks);
