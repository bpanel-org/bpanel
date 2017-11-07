import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'bpanel-ux';

import Header from '../../components/Header/Header';
import './app.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeInfo: ''
    };
  }

  getNodeInfo() {
    fetch('/node')
      .then(response => response.json())
      .then(data => {
        this.setState({ nodeInfo: JSON.stringify(data) });
      });
  }

  render() {
    return (
      <div className="app-container container-fluid" role="main">
        <Header />
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
            {this.state.nodeInfo}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
