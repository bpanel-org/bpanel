import React, { Component } from 'react';
const bsock = require('bsock');

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { nodeActions } from '../../store/actions/';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';
import Panel_ from '../../components/Panel/Panel';
import { decorate } from '../../utils/plugins';

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
    const { nodeInfo, loading, bcoinUri, nodeProgress = 0 } = this.props;

    return (
      <div className="app-container container-fluid" role="main">
        <Header
          network={nodeInfo.network}
          loading={loading}
          bcoinUri={bcoinUri}
        />
        <div className="row content-container">
          <Sidebar />
          <Panel />
        </div>
        <Footer version={nodeInfo.version} progress={nodeProgress} />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  nodeInfo: PropTypes.object,
  loading: PropTypes.bool,
  nodeProgress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bcoinUri: PropTypes.string,
  getNodeInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  nodeInfo: state.node.node,
  nodeProgress: state.node.chain.progress,
  bcoinUri: state.node.serverInfo.bcoinUri,
  loading: state.node.loading
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
