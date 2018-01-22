import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { decorate } from '../../plugins/plugins';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import { nodeActions, socketActions, themeActions } from '../../store/actions/';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar_ from '../../components/Sidebar/Sidebar';
import Panel from '../Panel/Panel';
import { plugins } from '../../store/selectors';
import { connect, decorateTheme } from '../../plugins/plugins';

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

const Sidebar = decorate(Sidebar_, 'Sidebar');

class App extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      loading: PropTypes.bool,
      bcoinUri: PropTypes.string,
      nodeInfo: PropTypes.object,
      children: PropTypes.node,
      nodeProgress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      sortedPluginMeta: PropTypes.arrayOf(
        PropTypes.shape({
          ...pluginMetaProps,
          subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
        })
      ),
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      theme: PropTypes.func,
      connectSocket: PropTypes.func.isRequired,
      disconnectSocket: PropTypes.func.isRequired,
      getNodeInfo: PropTypes.func.isRequired,
      updateTheme: PropTypes.func.isRequired
    };
  }

  async componentDidMount() {
    const { getNodeInfo, connectSocket } = this.props;
    connectSocket();
    getNodeInfo();
  }

  componentWillMount() {
    const { theme: themeCreator, updateTheme } = this.props;
    // Grab the original theme from props, then decorate the theme with
    // styling from the user's theme plugins. This returns a callback function that when invoked,
    // returns the proper styling. Update the Redux store with latest theme callback function
    const decoratedThemeFunc = decorateTheme(themeCreator);
    const themeConfig = this.handleThemeConfig(decoratedThemeFunc);
    updateTheme(decoratedThemeFunc);
    // Load theming for the <body> and <html> tags
    for (const k in themeConfig.app.body) {
      document.body.style[k] = themeConfig.app.body[k];
      document.documentElement.style[k] = themeConfig.app.body[k];
    }
  }

  componentWillUnmount() {
    const { theme } = this.props;
    const themeConfig = this.handleThemeConfig(theme);
    // Unload theming for the <body> and <html> tags
    for (const k in themeConfig.app.body) {
      document.body.style[k] = null;
      document.document.documentElement.style[k] = null;
    }
    this.props.disconnectSocket();
  }

  handleThemeConfig(theme) {
    return typeof theme === 'function' ? theme() : theme;
  }

  render() {
    const {
      nodeInfo,
      loading,
      bcoinUri,
      nodeProgress = 0,
      sortedPluginMeta,
      location,
      theme
    } = this.props;
    const themeConfig = this.handleThemeConfig(theme);

    return (
      <ThemeProvider theme={themeConfig}>
        <div
          className="container-fluid"
          role="main"
          style={themeConfig.app.container}
        >
          <div className="row">
            <div className="col-sm-4 col-lg-3" style={{ paddingLeft: 0 }}>
              <Sidebar
                sidebarNavItems={sortedPluginMeta}
                location={location}
                theme={themeConfig}
              />
            </div>
            <div className="col-sm-8 col-lg-9" style={themeConfig.app.content}>
              <Header
                network={nodeInfo.network}
                loading={loading}
                bcoinUri={bcoinUri}
              />
              <Panel />
            </div>
            <Footer version={nodeInfo.version} progress={nodeProgress} />
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  nodeInfo: state.node.node,
  nodeProgress: state.chain.progress,
  bcoinUri: state.node.serverInfo.bcoinUri,
  loading: state.node.loading,
  sortedPluginMeta: plugins.getSortedPluginMetadata(state),
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { connectSocket, disconnectSocket } = socketActions;
  const { updateTheme } = themeActions;
  return bindActionCreators(
    {
      getNodeInfo,
      connectSocket,
      disconnectSocket,
      updateTheme
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App, 'App');
