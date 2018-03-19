import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { Text, utils } from '@bpanel/bpanel-ui';
import Marker from './Marker';

const getCoords = async ({ addr, id }) => {
  const ip = addr.split(':').slice(0, 1);
  const response = await fetch(`http://freegeoip.net/json/${ip}`);
  const location = await response.json();
  const { latitude, longitude } = location;
  return { latitude, longitude, id };
};

class PeersMap extends Component {
  constructor(props) {
    super(props);
    this.state = { coordinates: [] };
  }

  static get defaultProps() {
    return {
      center: [59.938043, 30.337157],
      zoom: 1,
      peers: []
    };
  }

  static get propTypes() {
    return {
      center: PropTypes.array,
      zoom: PropTypes.number,
      peers: PropTypes.arrayOf(PropTypes.object),
      theme: PropTypes.object
    };
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.peers && this.props.peers[0] === nextProps.peers[0]) return;
    const { peers } = nextProps;
    if (peers.length) {
      const getCoordsPromises = peers.map(peer => getCoords(peer));
      const coordinates = await Promise.all(getCoordsPromises);
      this.setState({ coordinates });
    }
  }

  render() {
    const { center } = this.props;
    const { coordinates } = this.state;
    let markers;

    if (coordinates.length) {
      markers = coordinates.map(coord => (
        <Marker
          className="marker"
          lat={coord.latitude}
          lng={coord.longitude}
          key={coord.id}
          {...coord}
        />
      ));
    } else {
      markers = (
        <Text lat={center[0]} lng={center[1]} className="empty">
          Loading...
        </Text>
      );
    }
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: ['AIzaSyAt-64SBzyt3H3crm-C8xv010ns30J4J2c']
        }}
        center={this.props.center}
        zoom={this.props.zoom}
      >
        {markers}
      </GoogleMapReact>
    );
  }
}

export default PeersMap;
