import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Route, Redirect } from 'react-router';
import { getClient } from '@bpanel/bpanel-utils';

import ThemeProvider from '../ThemeProvider';
import {
  clientActions,
  nodeActions,
  socketActions,
  themeActions,
  navActions,
  appActions
} from '../../store/actions/';
import { APP_LOADED } from '../../store/constants/app';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import { nav } from '../../store/selectors';
import { pluginMetadata } from '../../store/propTypes';
import { connect } from '../../plugins/plugins';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    props.loadSideNav();
    this.client = null;
  }

  static get propTypes() {
    return {
      children: PropTypes.node,
      loadSideNav: PropTypes.func.isRequired,
      sidebarNavItems: pluginMetadata.sortedMetadataPropTypes,
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      theme: PropTypes.object,
      currentClient: PropTypes.shape({
        id: PropTypes.string,
        chain: PropTypes.string
      }),
      connectSocket: PropTypes.func.isRequired,
      disconnectSocket: PropTypes.func.isRequired,
      getNodeInfo: PropTypes.func.isRequired,
      getWindowInfo: PropTypes.func,
      updateTheme: PropTypes.func.isRequired,
      appLoaded: PropTypes.func.isRequired,
      hydrateClients: PropTypes.func.isRequired,
      resetClient: PropTypes.func.isRequired,
      match: PropTypes.shape({
        isExact: PropTypes.bool,
        path: PropTypes.string,
        url: PropTypes.string,
        params: PropTypes.object
      }).isRequired
    };
  }

  async componentDidMount() {
    const { getNodeInfo, connectSocket, hydrateClients } = this.props;

    await hydrateClients();
    this.client = getClient();
    this.client.on('set clients', () => this.updateApp());
    connectSocket();
    getNodeInfo();
  }

  async updateApp() {
    const { getNodeInfo, resetClient, hydrateClients } = this.props;
    await resetClient();
    await hydrateClients();
    getNodeInfo();
  }

  UNSAFE_componentWillMount() {
    const { updateTheme, appLoaded, getWindowInfo } = this.props;

    getWindowInfo();
    updateTheme();
    appLoaded();
  }

  componentWillUnmount() {
    // Unload theming for the <body> and <html> tags
    document.body.className = null;
    document.document.documentElement.className = null;
    this.props.disconnectSocket();
    this.client.removeListener('set clients', () => this.updateApp());
  }

  getHomePath() {
    const { sidebarNavItems } = this.props;
    const panels = sidebarNavItems.filter(
      plugin => plugin.sidebar || plugin.nav || React.isValidElement(plugin)
    );
    const homePath = panels[0]
      ? panels[0].pathName ? panels[0].pathName : panels[0].name
      : '';
    return homePath;
  }

  render() {
    const {
      sidebarNavItems,
      location,
      theme,
      match,
      currentClient
    } = this.props;
    return (
      <ThemeProvider theme={theme}>
        {currentClient.id ? (
          <div>
            <div
              className={`${theme.app.container} container-fluid`}
              role="main"
            >
              <div className="row">
                <div
                  className={`${theme.app.sidebarContainer} col-sm-4 col-lg-3`}
                >
                  <Sidebar
                    sidebarNavItems={sidebarNavItems}
                    location={location}
                    theme={theme}
                    match={match}
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
        ) : (
          <div />
        )}
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  // by default the sidebar items stay in an unsorted state in the
  // redux store. Using the selector you can get them sorted (and
  // it will only recalculate if there's been a change in the state)
  sidebarNavItems: nav.sortedSidebarItems(state),
  currentClient: state.clients.currentClient,
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { loadSideNav } = navActions;
  const { connectSocket, disconnectSocket } = socketActions;
  const { updateTheme } = themeActions;
  const { hydrateClients, resetClient, setCurrentClient } = clientActions;
  const { getWindowInfo } = appActions;
  const appLoaded = () => ({ type: APP_LOADED });
  return bindActionCreators(
    {
      appLoaded,
      hydrateClients,
      setCurrentClient,
      resetClient,
      getNodeInfo,
      loadSideNav,
      connectSocket,
      disconnectSocket,
      updateTheme,
      getWindowInfo
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App, 'App');
