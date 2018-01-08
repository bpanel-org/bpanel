import { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';

class ThemeProvider extends PureComponent {
  static get propTypes() {
    return {
      children: PropTypes.node,
      theme: PropTypes.object.isRequired
    };
  }

  static get childContextTypes() {
    return { theme: PropTypes.object.isRequired };
  }

  getChildContext() {
    const { theme } = this.props;
    return { theme };
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default ThemeProvider;
