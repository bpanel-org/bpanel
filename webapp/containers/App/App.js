import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import ThemeProvider from '../ThemeProvider';
import { nodeActions, socketActions, themeActions } from '../../store/actions/';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import { plugins } from '../../store/selectors';
import { connect } from '../../plugins/plugins';
import './app.scss';

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

class App extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      children: PropTypes.node,
      sortedPluginMeta: PropTypes.arrayOf(
        PropTypes.shape({
          ...pluginMetaProps,
          subItems: PropTypes.arrayOf(PropTypes.shape(pluginMetaProps))
        })
      ),
      location: PropTypes.shape({
        pathname: PropTypes.string
      }),
      theme: PropTypes.object,
      connectSocket: PropTypes.func.isRequired,
      disconnectSocket: PropTypes.func.isRequired,
      getNodeInfo: PropTypes.func.isRequired,
      updateTheme: PropTypes.func.isRequired
    };
  }

  async componentDidMount() {
    const { getNodeInfo, connectSocket } = this.props;
    connectSocket();
    getNodeInfo();
  }

  componentWillMount() {
    const { updateTheme } = this.props;
    updateTheme();
  }

  componentWillUnmount() {
    // Unload theming for the <body> and <html> tags
    document.body.className = null;
    document.document.documentElement.className = null;
    this.props.disconnectSocket();
  }

  render() {
    const { sortedPluginMeta, location, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div className={`${theme.app.container} container-fluid`} role="main">
          <div className="row">
            <div className={`${theme.app.sidebarContainer} col-sm-4 col-lg-3`}>
              <Sidebar
                sidebarNavItems={sortedPluginMeta}
                location={location}
                theme={theme}
              />
            </div>
            <div className={`${theme.app.content} col-sm-8 col-lg-9`}>
              <Header />
              <Panel />
            </div>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  sortedPluginMeta: plugins.getSortedPluginMetadata(state),
  theme: state.theme
});

const mapDispatchToProps = dispatch => {
  const { getNodeInfo } = nodeActions;
  const { connectSocket, disconnectSocket } = socketActions;
  const { updateTheme } = themeActions;
  return bindActionCreators(
    {
      getNodeInfo,
      connectSocket,
      disconnectSocket,
      updateTheme
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App, 'App');
