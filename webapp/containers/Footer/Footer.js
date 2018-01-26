import { connect } from '../../plugins/plugins';
import Footer from '../../components/Footer/Footer';

const mapPropsWithState = state => ({ ...state });
const mapPropsWithDispatch = () => ({});

const FooterContainer = connect(mapPropsWithState, mapPropsWithDispatch)(
  Footer,
  'Footer'
);

export default FooterContainer;
