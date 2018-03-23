import { connect } from '../plugins/plugins';
import Header from '../components/Header';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(
  Header,
  'Header'
);

export default HeaderContainer;
