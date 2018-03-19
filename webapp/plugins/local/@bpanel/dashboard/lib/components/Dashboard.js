import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Text } from '@bpanel/bpanel-ui';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      customChildrenBefore: PropTypes.node,
      primaryWidget: PropTypes.node,
      bottomWidgets: PropTypes.array,
      customChildrenAfter: PropTypes.node
    };
  }

  render() {
    const {
      customChildrenBefore,
      primaryWidget,
      bottomWidgets = [],
      customChildrenAfter
    } = this.props;
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
        <div className="row">{primaryWidget}</div>
        <div className="row">
          {bottomWidgets.map((Widget, index) => <Widget key={index} />)}
        </div>
        <div className="row">{customChildrenAfter}</div>
      </div>
    );
  }
}
