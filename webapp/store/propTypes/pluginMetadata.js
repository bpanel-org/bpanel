import PropTypes from 'prop-types';

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

export const sortedMetadataPropTypes = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.shape({
      ...pluginMetaProps,
      subItems: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.node, PropTypes.shape(pluginMetaProps)])
      )
    })
  ])
);

export default {
  pluginMetaProps,
  sortedMetadataPropTypes
};
