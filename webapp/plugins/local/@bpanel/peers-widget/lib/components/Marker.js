import React from 'react';
import PropTypes from 'prop-types';

import { Text, utils } from '@bpanel/bpanel-ui';

const { connectTheme, makeRem } = utils;
const markerStyle = {
  color: 'white',
  width: '20px',
  height: '20px',
  paddingTop: '3px',
  textAlign: 'center',
  borderRadius: '21px'
};
const Marker = ({
  id,
  theme: {
    themeVariables: { themeColors: { highlight1 }, rawRem: { fontSizeSmall } }
  }
}) => {
  const fontSize = makeRem(fontSizeSmall);

  return (
    <Text
      type="p"
      style={{
        ...markerStyle,
        backgroundColor: highlight1,
        fontSize: fontSize
      }}
    >
      {id}
    </Text>
  );
};

Marker.propTypes = {
  id: PropTypes.number,
  theme: PropTypes.object
};

export default connectTheme(Marker);
