import React, { PureComponent } from 'react';
import { Header, Input, Link, Button, Text, Table, TabMenu } from 'bpanel-ui';
import tableProps from './constants/tableProps';

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
        <form>
          <Input
            type="text"
            name="text"
            placeholder="Text Input"
            style={{ marginBottom: '5px' }}
          />
          <br />
          <Input
            type="password"
            name="password"
            placeholder="Add your password"
            style={{ marginBottom: '5px' }}
          />
          <br />
          <Input
            type="submit"
            name="submit"
            value="Submit"
            style={{ marginBottom: '5px', marginRight: '5px' }}
          />
          <Input
            type="reset"
            name="reset"
            value="Reset"
            style={{ marginBottom: '5px', marginRight: '5px' }}
          />
        </form>
        <form>
          <Input type="radio" name="radio" value="yes" checked /> Yes<br />
          <Input type="radio" name="radio" value="no" /> No<br />
          <Input type="radio" name="radio" value="maybe" /> Maybe<br />
        </form>
        <Table {...tableProps} />
        <TabMenu />
      </div>
    );
  }
}
