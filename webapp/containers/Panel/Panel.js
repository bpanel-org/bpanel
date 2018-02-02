import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';

import { connect } from '../../plugins/plugins';
import Panel from '../../components/Panel/Panel';
import { socketActions } from '../../store/actions';

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...socketActions }, dispatch);

const PanelContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Panel, 'Panel')
);

export default PanelContainer;
