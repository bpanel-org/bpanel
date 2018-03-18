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
      bottomWidgets: PropTypes.node
    };
  }

  render() {
    const { customChildrenBefore, primaryWidget, bottomWidgets } = this.props;
    return (
      <div className="dashboard-container">
        <Header type="h2">bPanel Dashboard</Header>
        <Text type="p">
          A simple Dashboard view that can be decorated by widgets. Widgets
          allow you to extend your dashboard according to your needs.
        </Text>
        {customChildrenBefore}
        <Text type="p">
          Everything in this view is its own widget and can be edited, removed,
          and rearranged as desired.
        </Text>
        {primaryWidget}
        {bottomWidgets}
      </div>
    );
  }
}
