import React from 'react';
import { Text } from '@bpanel/bpanel-ui';

const PeerComponentCreator = (Component_, peers = []) =>
  class extends React.Component {
    constructor(props) {
      super(props);
    }

    static displayName() {
      return 'Peers List';
    }

    render() {
      if (peers.length > 0) return <Component_ peers={peers} />;

      return <Text type="p">Loading Peers...</Text>;
    }
  };

export default PeerComponentCreator;
