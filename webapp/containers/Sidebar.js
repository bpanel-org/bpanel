import { connect } from '../plugins/plugins';
import Sidebar from '../components/Sidebar/Sidebar';

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = () => ({});

const SidebarContainer = connect(mapStateToProps, mapDispatchToProps)(
  Sidebar,
  'Sidebar'
);

export default SidebarContainer;
