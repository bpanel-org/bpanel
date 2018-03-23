import { connect } from '../plugins/plugins';
import Sidebar from '../components/Sidebar';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

const SidebarContainer = connect(mapStateToProps, mapDispatchToProps)(
  Sidebar,
  'Sidebar'
);

export default SidebarContainer;
