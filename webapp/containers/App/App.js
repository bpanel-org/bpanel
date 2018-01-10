import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ThemeProvider from '../ThemeProvider/ThemeProvider';
import { nodeActions, socketActions } from '../../store/actions/';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import Panel from '../Panel/Panel';
import { plugins } from '../../store/selectors';
import theme from '../../config/themeConfig';

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { getNodeInfo, connectSocket } = this.props;
    connectSocket();
    getNodeInfo();
  }

  componentWillMount() {
    // Load theming for the <body> and <html> tags
    for (const k in theme.app.body) {
      document.body.style[k] = theme.app.body[k];
      document.documentElement.style[k] = theme.app.body[k];
    }
  }

  componentWillUnmount() {
    // Unload theming for the <body> and <html> tags
    for (const k in theme.app.body) {
      document.body.style[k] = null;
      document.document.documentElement.style[k] = null;
    }
    this.props.disconnectSocket();
  }

  render() {
    const {
      nodeInfo,
      loading,
      bcoinUri,
      nodeProgress = 0,
      sortedPluginMeta,
      location
    } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <div
          className="container-fluid"
          role="main"
          style={theme.app.container}
        >
          <div className="row">
            <div className="col-sm-4 col-lg-3" style={{ paddingLeft: 0 }}>
              <Sidebar sidebarItems={sortedPluginMeta} location={location} />
            </div>
            <div className="col-sm-8 col-lg-9" style={theme.app.content}>
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

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

App.propTypes = {
  children: PropTypes.node,
  nodeInfo: PropTypes.object,
  loading: PropTypes.bool,
  nodeProgress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bcoinUri: PropTypes.string,
  getNodeInfo: PropTypes.func.isRequired,
  connectSocket: PropTypes.func.isRequired,
  disconnectSocket: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  sortedPluginMeta: PropTypes.arrayOf(
    PropTypes.shape({
      ...pluginMetaProps,
      subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
    })
  )
};

const mapStateToProps = state => ({
  nodeInfo: state.node.node,
  nodeProgress: state.chain.progress,
  bcoinUri: state.node.serverInfo.bcoinUri,
  loading: state.node.loading,
  sortedPluginMeta: plugins.getSortedPluginMetadata(state)
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { connectSocket, disconnectSocket } = socketActions;
  return bindActionCreators(
    {
      getNodeInfo,
      connectSocket,
      disconnectSocket
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
