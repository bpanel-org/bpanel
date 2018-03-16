import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  Input,
  Link,
  Button,
  Text,
  Table,
  TabMenu,
  utils
} from '@bpanel/bpanel-ui';
import tableProps from './constants/tableProps';
import * as codeSnippets from './constants/codeSnippets';

const { connectTheme } = utils;
const {
  h1Code,
  h2Code,
  h3Code,
  h4Code,
  h5Code,
  h6Code,
  spanCode1,
  spanCode2,
  pCode,
  strongCode,
  linkCode,
  externalLinkCode,
  buttonPrimaryCode,
  buttonActionCode,
  loginFormCode,
  radioFormCode,
  fileUploadCode,
  tableCode,
  tabMenuCode
} = codeSnippets;

class Bui extends PureComponent {
  getStyles() {
    const {
      theme: { themeVariables: { border2, themeColors: { darkBg } } }
    } = this.props;
    return {
      componentContainer: {
        paddingBottom: '2rem'
      },
      componentFamilyContainer: {
        paddingBottom: '4rem'
      },
      borderBottom: {
        paddingBottom: '0.5rem',
        borderBottom: border2
      },
      xmp: {
        backgroundColor: darkBg,
        padding: '0.5rem'
      }
    };
  }

  static get propTypes() {
    return {
      theme: PropTypes.object
    };
  }

  render() {
    const styles = this.getStyles();
    return (
      <div>
        <div style={styles.componentFamilyContainer}>
          <div style={styles.componentContainer}>
            <Header type="h1" style={styles.borderBottom}>
              bPanel Component Library
            </Header>
          </div>
          <div style={styles.componentContainer}>
            <Text type="p">
              {`Welcome to the bPanel Component Library! The goal of this library
              is to provide components that all receive default and user defined
              theming. To make the best plugins possible, it's recommended that
              you use these components so that all of your components look like
              they visually belong within user defined themes. Making a plugin
              without these components is still possible, but your component
              will not receive theming from themes that users choose to apply,
              and will tend to look out of place.`}
            </Text>
            <br />
            <Text type="p">
              {`PRs are welcome, if you have a component you'd like to add or
              modify, feel free to make a PR at`}
              <br />
              <Link to="https://github.com/bcoin-org/bpanel-ui">
                https://github.com/bcoin-org/bpanel-ui
              </Link>
            </Text>
          </div>
          <Header type="h2">Headers</Header>
          <div style={styles.componentContainer}>
            <Header type="h1">H1 tag</Header>
            <xmp style={styles.xmp}>{h1Code}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Header type="h2">H2 tag</Header>
            <xmp style={styles.xmp}>{h2Code}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Header type="h3">H3 tag</Header>
            <xmp style={styles.xmp}>{h3Code}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Header type="h4">H4 tag</Header>
            <xmp style={styles.xmp}>{h4Code}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Header type="h5">H5 tag</Header>
            <xmp style={styles.xmp}>{h5Code}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Header type="h6">H6 tag</Header>
            <xmp style={styles.xmp}>{h6Code}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">Text</Header>
          <div style={styles.componentContainer}>
            <Text>Text span Component</Text>
            <br />
            <xmp style={styles.xmp}>{spanCode1}</xmp>
            <br />
            <xmp style={styles.xmp}>{spanCode2}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Text type="p">Text p Component</Text>
            <xmp style={styles.xmp}>{pCode}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Text type="strong">Text strong Component</Text>
            <br />
            <xmp style={styles.xmp}>{strongCode}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">Link</Header>
          <div style={styles.componentContainer}>
            <Link to="/wallets">Link Component.</Link>
            <br />
            <xmp style={styles.xmp}>{linkCode}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Link to="http://bcoin.io/">External Link to Bcoin.</Link>
            <br />
            <xmp style={styles.xmp}>{externalLinkCode}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">Buttons</Header>
          <div style={styles.componentContainer}>
            <Button type="primary">Primary Button Component</Button>
            <br />
            <xmp style={styles.xmp}>{buttonPrimaryCode}</xmp>
          </div>
          <div style={styles.componentContainer}>
            <Button type="action">Action Button Component</Button>
            <br />
            <xmp style={styles.xmp}>{buttonActionCode}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">Forms</Header>
          <Header type="h3">Login Form</Header>
          <div style={styles.componentContainer}>
            <form>
              <Input
                type="text"
                name="text"
                placeholder="Text Input"
                style={{ marginBottom: '5px', marginRight: '5px' }}
              />
              <Input
                type="password"
                name="password"
                placeholder="Add your password"
                style={{ marginBottom: '5px', marginRight: '5px' }}
              />
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
            <xmp style={styles.xmp}>{loginFormCode}</xmp>
          </div>
          <Header type="h3">Radio Form</Header>
          <div style={styles.componentContainer}>
            <form>
              <Input type="radio" name="radio" value="yes" checked /> Yes<br />
              <Input type="radio" name="radio" value="no" /> No<br />
              <Input type="radio" name="radio" value="maybe" /> Maybe<br />
            </form>
            <xmp style={styles.xmp}>{radioFormCode}</xmp>
          </div>
          <Header type="h3">File Upload Form</Header>
          <div style={styles.componentContainer}>
            <form>
              Upload a file<br />
              <Input type="file" name="file" />
            </form>
            <xmp style={styles.xmp}>{fileUploadCode}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">Table</Header>
          <div style={styles.componentContainer}>
            <Table {...tableProps} />
            <xmp style={styles.xmp}>{tableCode}</xmp>
          </div>
        </div>
        <div style={styles.componentFamilyContainer}>
          <Header type="h2">TabMenu</Header>
          <div style={styles.componentContainer}>
            <TabMenu />
            <xmp style={styles.xmp}>{tabMenuCode}</xmp>
          </div>
        </div>
      </div>
    );
  }
}

export default connectTheme(Bui);
