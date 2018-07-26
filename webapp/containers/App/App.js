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
import { pluginMetadata } from '../../store/propTypes';
import { connect } from '../../plugins/plugins';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      children: PropTypes.node,
      sidebarNavItems: pluginMetadata.sortedMetadataPropTypes,
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      theme: PropTypes.object,
      connectSocket: PropTypes.func.isRequired,
      disconnectSocket: PropTypes.func.isRequired,
      getNodeInfo: PropTypes.func.isRequired,
      updateTheme: PropTypes.func.isRequired,
      appLoaded: PropTypes.func.isRequired,
      match: PropTypes.shape({
        isExact: PropTypes.bool,
        path: PropTypes.string,
        url: PropTypes.string,
        params: PropTypes.object
      }).isRequired
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
    const { sidebarNavItems } = this.props;
    const panels = sidebarNavItems.filter(
      plugin => plugin.sidebar || plugin.nav || React.isValidElement(plugin)
    );
    const homePath = panels[0]
      ? panels[0].pathName
        ? panels[0].pathName
        : panels[0].name
      : '';
    return homePath;
  }

  render() {
    const { sidebarNavItems, location, theme, match } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div className={`${theme.app.container} container-fluid`} role="main">
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
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  sidebarNavItems: state.nav.sidebar,
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { connectSocket, disconnectSocket } = socketActions;
  const { updateTheme } = themeActions;
  const appLoaded = () => ({ type: 'APP_LOADED' });
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App, 'App');
