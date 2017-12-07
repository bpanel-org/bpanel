import React, { Component } from 'react';
import bsock from 'bsock';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { nodeActions } from '../../store/actions/';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import Panel_ from '../../components/Panel/Panel';
import { decorate } from '../../utils/plugins';
import { plugins } from '../../store/selectors';

import './app.scss';

const Panel = decorate(Panel_, 'Panel');

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // TODO: Socket management should be put into a reducer
    const { getNodeInfo, updateChainInfo } = this.props;
    const socket = bsock.connect(8000);
    socket.on('connect', async () => {
      socket.bind('chain progress', raw => {
        const progress = parseFloat(raw.toString('ascii'));
        updateChainInfo({ progress });
      });
    });

    socket.on('error', err => console.log(err)); // eslint-disable-line no-console

    getNodeInfo();
  }

  render() {
    const {
      nodeInfo,
      loading,
      bcoinUri,
      nodeProgress = 0,
      sortedPluginMeta
    } = this.props;
    return (
      <Router>
        <div className="app-container container-fluid" role="main">
          <Header
            network={nodeInfo.network}
            loading={loading}
            bcoinUri={bcoinUri}
          />
          <div className="row content-container">
            <Sidebar sidebarItems={sortedPluginMeta} />
            <Panel />
          </div>
          <Footer version={nodeInfo.version} progress={nodeProgress} />
        </div>
      </Router>
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
  sortedPluginMeta: PropTypes.arrayOf(
    PropTypes.shape({
      ...pluginMetaProps,
      subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
    })
  )
};

const mapStateToProps = state => ({
  nodeInfo: state.node.node,
  nodeProgress: state.node.chain.progress,
  bcoinUri: state.node.serverInfo.bcoinUri,
  loading: state.node.loading,
  sortedPluginMeta: plugins.getSortedPluginMetadata(state)
});

const mapDispatchToProps = dispatch => {
  const { setNodeInfo, getNodeInfo, updateChainInfo } = nodeActions;
  return bindActionCreators(
    {
      setNodeInfo,
      getNodeInfo,
      updateChainInfo
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
