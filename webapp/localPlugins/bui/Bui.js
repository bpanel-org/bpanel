import React, { PureComponent } from 'react';
import * as UI from 'bpanel-ui';
import tableProps from './constants/tableProps';

const { components: { Header, Link, Button, Text, Table: { Table } } } = UI;

export default class Bui extends PureComponent {
  render() {
    return (
      <div>
        <Header type="h1">H1 tag</Header>
        <Header type="h2">H2 tag</Header>
        <Header type="h3">H3 tag</Header>
        <Header type="h4">H4 tag</Header>
        <Header type="h5">H5 tag</Header>
        <Header type="h6">H6 tag</Header>
        <Text>Text default Component</Text>
        <br />
        <Text type="p">Text p tag Component</Text>
        <Text type="strong">Text strong tag Component</Text>
        <br />
        <Link to="/wallets">Link Component.</Link>
        <br />
        <Link to="http://bcoin.io/">External Link to Bcoin.</Link>
        <br />
        <Button type="primary">Primary Button Component</Button>
        <Button type="action">Action Button Component</Button>
        <br />
        <Table {...tableProps} />
      </div>
    );
  }
}
