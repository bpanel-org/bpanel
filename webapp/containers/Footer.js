import { connect } from '../plugins/plugins';
import Footer from '../components/Footer';

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

const FooterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer, 'Footer');

export default FooterContainer;
