// Entry point for your plugin
// This should expose your plugin's modules/* START IMPORTS */
import modules from './plugins';
import FilterForm from './components/FilterForm';
/* END IMPORTS */

const plugins = Object.keys(modules).map(name => modules[name]);

/* START EXPORTS */

export const metadata = {
  name: '@bpanel/simple-filters',
  pathName: '',
  displayName: 'Simple Filters',
  author: 'bpanel-org',
  description: 'A simple widget for retrieving block filter information',
  version: require('../package.json').version
};

export const pluginConfig = { plugins };

const FiltersWidget = (Dashboard, { React, PropTypes }) =>
  class extends React.PureComponent {
    constructor(props) {
      super(props);
    }

    static get displayName() {
      return metadata.displayName;
    }

    static get propTypes() {
      return {
        customChildrenBefore: PropTypes.oneOfType([
          PropTypes.array,
          PropTypes.node
        ])
      };
    }

    render() {
      const { customChildrenBefore: existingChildren } = this.props;
      const customChildrenBefore = (
        <div className="col-4">
          <FilterForm />
          {existingChildren}
        </div>
      );
      return (
        <Dashboard
          {...this.props}
          customChildrenBefore={customChildrenBefore}
        />
      );
    }
  };

export const decoratePlugin = { '@bpanel/dashboard': FiltersWidget };
/* END EXPORTS */
