import { connect } from '../plugins/plugins';
import Header from '../components/Header/Header';

const mapPropsWithState = state => ({ ...state });
const mapPropsWithDispatch = () => ({});

const HeaderContainer = connect(mapPropsWithState, mapPropsWithDispatch)(
  Header,
  'Header'
);

export default HeaderContainer;
