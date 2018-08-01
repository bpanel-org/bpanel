import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import { connect } from '../plugins/plugins';
import Panel from '../components/Panel';
import { socketActions } from '../store/actions';
import { nav } from '../store/selectors';

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
  )(Panel, 'Panel')
);

export default PanelContainer;
