// Entry point for your plugin
// This should expose your plugin's modules

import * as chainSockets from '@bpanel/chain-sockets';
import Dashboard from './components/Dashboard';

let _DecoratedDashboard = Dashboard;

export const metadata = {
  name: '@bpanel/dashboard',
  pathName: 'dashboard',
  displayName: 'bPanel Dashboard',
  author: 'bcoin-org',
  description:
    'A bPanel plugin for displaying node and blockchain information at a glance.',
  version: require('../package.json').version,
  sidebar: true,
  icon: 'home',
  order: 0
};

// special plugin decorator to allow other plugins to decorate this plugin
// the component is cached so that it is available for the main decorator below
// (`decoratePanel`) and cached component passed to pluginDecorator
export const decorator = (pluginDecorator, { React, PropTypes }) => {
  _DecoratedDashboard = pluginDecorator(_DecoratedDashboard, {
    React,
    PropTypes
  });
};

// a decorator for the Panel container component in our app
// here we're extending the Panel's children by adding
// our plugin's component (`MyComponent` below)
// You'll want to make sure to import an actual component
// This is what you need if you're making a new view/route
export const decoratePanel = (Panel, { React, PropTypes }) => {
  return class extends React.Component {
    static displayName() {
      return metadata.displayName;
    }

    static get propTypes() {
      return {
        customChildren: PropTypes.array
      };
    }

    render() {
      const { customChildren = [] } = this.props;
      const routeData = {
        metadata,
        Component: _DecoratedDashboard
      };
      return (
        <Panel
          {...this.props}
          customChildren={customChildren.concat(routeData)}
        />
      );
    }
  };
};

export const pluginConfig = {
  plugins: [chainSockets]
};

/* END EXPORTS */
