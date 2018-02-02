import { connect } from '../plugins/plugins';
import Header from '../components/Header/Header';

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = () => ({});

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(
  Header,
  'Header'
);

export default HeaderContainer;
