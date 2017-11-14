import React, { Component } from 'react';
const bsock = require('bsock');

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'bpanel-ux';

import { nodeActions } from '../../store/actions/';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // TODO: This should be put into a reducer
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
      getNodeInfo
    } = this.props;

    return (
      <div className="app-container container-fluid" role="main">
        <div className="content">
          <Header
            network={nodeInfo.network}
            loading={loading}
            bcoinUri={bcoinUri}
          />
          <div className="row justify-content-center">
            <h1 className="col">Hello World!</h1>
            {this.props.children}
          </div>
          <div className="row justify-content-center">
            <div className="col-4">
              <Button type="default" onClick={() => getNodeInfo()}>
                Click Me
              </Button>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-6">
              <h2>Node Info:</h2>
              {JSON.stringify(nodeInfo)}
            </div>
          </div>
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
