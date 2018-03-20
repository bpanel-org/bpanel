import React from 'react';
import PropTypes from 'prop-types';
import { Text, Header, utils } from '@bpanel/bpanel-ui';
import { Gmaps, Marker } from 'react-gmaps';

import { getPeerCoordinates } from '../selectors/peers';
import getMarkerStyles from './markerStyles';
const { connectTheme } = utils;

class PeersMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.center = {
      lat: 51.5258541,
      lng: -0.08040660000006028
    };
    this.mapParams = {
      v: '3.exp',
      key: 'AIzaSyAt-64SBzyt3H3crm-C8xv010ns30J4J2c'
    };
    this.state = { coordinates: [] };
  }

  static get propTypes() {
    return {
      peers: PropTypes.arrayOf(PropTypes.object),
      theme: PropTypes.object,
      coordinates: PropTypes.arrayOf(PropTypes.object)
    };
  }

  async componentWillReceiveProps(nextProps) {
    const { peers } = nextProps;
    if (peers.length) {
      const coordinates = await getPeerCoordinates(peers);
      this.setState({ coordinates });
    }
  }

  render() {
    const { coordinates } = this.state;
    const {
      theme: { themeVariables: { themeColors: { highlight1: highlight } } }
    } = this.props;
    let markers;

    const markerProps = getMarkerStyles(highlight);
    if (coordinates.length) {
      markers = coordinates.map(({ latitude, longitude, id }) => (
        <Marker
          lat={latitude}
          lng={longitude}
          key={id}
          label={{ text: id.toString() }}
          {...markerProps}
        />
      ));
    } else {
      markers = <Text className="empty">Loading peers...</Text>;
    }

    return (
      <div>
        <Header type="h3">Peer Locations</Header>
        <Text type="p">
          Below are the approximate locations of your peers based on IP address
        </Text>
        <Gmaps
          lat={this.center.lat}
          lng={this.center.lng}
          height={'300px'}
          zoom={2}
          loadingMessage={'Loading peers map...'}
          params={this.mapParams}
        >
          {markers}
        </Gmaps>
      </div>
    );
  }
}

export default connectTheme(PeersMap);
