import { withRouter } from 'react-router';

import { connect } from '../../plugins/plugins';
import Panel from '../../components/Panel/Panel';

const PanelContainer = withRouter(connect()(Panel, 'Panel'));

export default PanelContainer;
