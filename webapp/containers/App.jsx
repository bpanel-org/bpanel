import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'bpanel-ux';

import '../styles/app.scss';

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
      <div className="app-container" role="main">
        <h1>Hello World!</h1>
        {this.props.children}
        <Button type="default" onClick={() => this.getNodeInfo()}>
          Click Me
        </Button>
        <h2>Node Info:</h2>
        {this.state.nodeInfo}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
