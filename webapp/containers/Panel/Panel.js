import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import { connect } from '../../plugins/plugins';
import Panel from '../../components/Panel/Panel';
import { socketActions } from '../../store/actions';

const mapPropsWithState = state => ({ ...state });
const mapPropsWithDispatch = dispatch =>
  bindActionCreators({ ...socketActions }, dispatch);

const PanelContainer = withRouter(
  connect(mapPropsWithState, mapPropsWithDispatch)(Panel, 'Panel')
);

export default PanelContainer;
