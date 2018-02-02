import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import { decorate } from '../../plugins/plugins';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import { nodeActions, socketActions, themeActions } from '../../store/actions/';
import Header from '../../containers/Header';
import Footer from '../../containers/Footer/Footer';
import Sidebar_ from '../../components/Sidebar/Sidebar';
import Panel from '../Panel/Panel';
import { plugins } from '../../store/selectors';
import { connect } from '../../plugins/plugins';
import './app.scss';

export const pluginMetaProps = {
  name: PropTypes.string.isRequired,
  order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parent: PropTypes.string,
  icon: PropTypes.string
};

const Sidebar = decorate(Sidebar_, 'Sidebar');

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
    const { theme } = this.props;
    // Unload theming for the <body> and <html> tags
    for (const k in theme.app.body) {
      document.body.style[k] = null;
      document.document.documentElement.style[k] = null;
    }
    this.props.disconnectSocket();
  }

  render() {
    const { sortedPluginMeta, location, theme } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <div
          className="container-fluid"
          role="main"
          style={theme.app.container}
        >
          <div className="row">
            <div className="col-sm-4 col-lg-3" style={{ paddingLeft: 0 }}>
              <Sidebar
                sidebarNavItems={sortedPluginMeta}
                location={location}
                theme={theme}
              />
            </div>
            <div className="col-sm-8 col-lg-9" style={theme.app.content}>
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
