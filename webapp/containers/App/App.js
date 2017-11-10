import React, { Component } from 'react';
const bsock = require('bsock');

import PropTypes from 'prop-types';
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

  getNodeInfo() {
    const { dispatch } = this.props;
    let action = nodeActions.getNodeInfo();
    dispatch(action);
  }

  async componentDidMount() {
    const socket = bsock.connect(8000);
    socket.on('connect', async () => {
      console.log('connected');
      socket.bind('chain progress', progress => {
        console.log('chain progress: ', progress);
      });
      // console.log('Calling foo...');
      // // Call = emit event and wait for ack
      // const data = await socket.call('foo');
      // console.log('Response for foo: %s.', data.toString('ascii'));
      // console.log('Sending bar...');
      // // Fire = emit event
      // socket.fire('bar', Buffer.from('baz'));
    });

    this.getNodeInfo();
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
        <div className="row justify-content-center">
          <h1 className="col">Hello World!</h1>
          {this.props.children}
        </div>
        <div className="row justify-content-center">
          <div className="col-4">
            <Button type="default" onClick={() => this.getNodeInfo()}>
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
        <Footer version={nodeInfo.version} progress={nodeProgress} />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  nodeInfo: PropTypes.object,
  loading: PropTypes.bool,
  bcoinUri: PropTypes.string
};

const mapStateToProps = state => ({
  nodeInfo: state.node.node,
  nodeProgress: state.node.chain.progress,
  bcoinUri: state.node.serverInfo.bcoinUri,
  loading: state.node.loading
});

export default connect(mapStateToProps)(App);
