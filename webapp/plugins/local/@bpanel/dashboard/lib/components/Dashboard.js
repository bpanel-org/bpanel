import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Text } from '@bpanel/bpanel-ui';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static get propTypes() {
    return {
      customChildrenBefore: PropTypes.node,
      primaryWidget: PropTypes.node,
      bottomWidgets: PropTypes.array,
      customChildrenAfter: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.node
      ])
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    // eslint-disable-next-line no-console
    console.error(
      `Plugins decorating ${name} has been disabled because of a plugin crash.`,
      error,
      errorInfo
    );
  }

  render() {
    const {
      customChildrenBefore,
      primaryWidget,
      bottomWidgets = [],
      customChildrenAfter
    } = this.props;
    if (this.state.hasError)
      return <Text type="p">There was a widget error</Text>;
    return (
      <div className="dashboard-container container">
        <Header type="h2">bPanel Dashboard</Header>
        <Text type="p">
          A simple Dashboard view that can be decorated by widgets. Widgets
          allow you to extend your dashboard according to your needs.
        </Text>
        <div className="row">{customChildrenBefore}</div>
        <Text type="p">
          Everything in this view is its own widget and can be edited, removed,
          and rearranged as desired.
        </Text>
        <div className="row mt-3">{primaryWidget}</div>
        <div className="row mt-3">
          {bottomWidgets.map((Widget, index) => <Widget key={index} />)}
        </div>
        <div className="row mt-3">
          {Array.isArray(customChildrenAfter)
            ? customChildrenAfter.map((Child, index) => <Child key={index} />)
            : customChildrenAfter}
        </div>
      </div>
    );
  }
}
