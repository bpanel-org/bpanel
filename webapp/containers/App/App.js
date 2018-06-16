import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Route, Redirect } from 'react-router';

import ThemeProvider from '../ThemeProvider';
import { nodeActions, socketActions, themeActions } from '../../store/actions/';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import { plugins } from '../../store/selectors';
import { connect } from '../../plugins/plugins';
import './app.scss';

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      children: PropTypes.node,
      sortedPluginMeta: PropTypes.arrayOf(
        PropTypes.shape({
          ...pluginMetaProps,
          subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
        })
      ),
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      theme: PropTypes.object,
      connectSocket: PropTypes.func.isRequired,
      disconnectSocket: PropTypes.func.isRequired,
      getNodeInfo: PropTypes.func.isRequired,
      updateTheme: PropTypes.func.isRequired,
      appLoaded: PropTypes.func.isRequired
    };
  }

  async componentDidMount() {
    const { getNodeInfo, connectSocket } = this.props;
    connectSocket();
    getNodeInfo();
  }

  UNSAFE_componentWillMount() {
    const { updateTheme, appLoaded } = this.props;
    updateTheme();
    appLoaded();
  }

  componentWillUnmount() {
    // Unload theming for the <body> and <html> tags
    document.body.className = null;
    document.document.documentElement.className = null;
    this.props.disconnectSocket();
  }

  getHomePath() {
    const { sortedPluginMeta } = this.props;
    const panels = sortedPluginMeta.filter(
      plugin => plugin.sidebar || React.isValidElement(plugin)
    );
    const homePath = panels[0]
      ? panels[0].pathName
        ? panels[0].pathName
        : panels[0].name
      : '';
    return homePath;
  }

  render() {
    const { sortedPluginMeta, location, theme } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div className={`${theme.app.container} container-fluid`} role="main">
            <div className="row">
              <div
                className={`${theme.app.sidebarContainer} col-sm-4 col-lg-3`}
              >
                <Sidebar
                  sidebarNavItems={sortedPluginMeta}
                  location={location}
                  theme={theme}
                />
              </div>
              <div className={`${theme.app.content} col-sm-8 col-lg-9`}>
                <Header />
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to={`/${this.getHomePath()}`} />}
                />
                <Panel />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  sortedPluginMeta: plugins.getSortedPluginMetadata(state),
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { connectSocket, disconnectSocket } = socketActions;
  const { updateTheme } = themeActions;
  const appLoaded = () => {
    return { type: 'APP_LOADED' };
  };
  return bindActionCreators(
    {
      appLoaded,
      getNodeInfo,
      connectSocket,
      disconnectSocket,
      updateTheme
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App, 'App');
