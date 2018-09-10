import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import Loadable from 'react-loadable';
import { Spinner } from '@bpanel/bpanel-ui';

import { connect } from '../plugins/plugins';
import { socketActions } from '../store/actions';
import { nav } from '../store/selectors';

const LoadablePanel = Loadable({
  loader: () => import('../components/Panel'),
  loading: Spinner
});

const mapStateToProps = state => ({
  paths: nav.uniquePathsByName(state),
  theme: state.theme
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...socketActions }, dispatch);

const PanelContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoadablePanel, 'Panel')
);

export default PanelContainer;
