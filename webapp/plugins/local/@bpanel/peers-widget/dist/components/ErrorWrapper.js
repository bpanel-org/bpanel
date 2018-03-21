'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(
  _possibleConstructorReturn2
);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bpanelUi = require('@bpanel/bpanel-ui');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ErrorWrapper(Component_) {
  var name =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  return (function(_React$PureComponent) {
    (0, _inherits3.default)(ErrorComponent, _React$PureComponent);

    function ErrorComponent(props) {
      (0, _classCallCheck3.default)(this, ErrorComponent);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (ErrorComponent.__proto__ ||
          (0, _getPrototypeOf2.default)(ErrorComponent)
        ).call(this, props)
      );

      _this.state = { hasError: false };
      return _this;
    }

    (0, _createClass3.default)(ErrorComponent, [
      {
        key: 'componentDidCatch',
        value: function componentDidCatch(error, errorInfo) {
          this.setState({ hasError: true });
          // eslint-disable-next-line no-console
          console.error(
            'Plugin' +
              (name ? ', ' + name + ',' : '') +
              ' has been disabled because of a plugin crash.',
            error,
            errorInfo
          );
        }
      },
      {
        key: 'render',
        value: function render() {
          if (this.state.hasError) {
            return _react2.default.createElement(
              _bpanelUi.Text,
              { type: 'p' },
              'Your plugin',
              name ? ', ' + name + ',' : '',
              ' has experienced an error and could not load. Please check the JavaScript console for more details'
            );
          }
          return _react2.default.createElement(Component_, this.props);
        }
      }
    ]);
    return ErrorComponent;
  })(_react2.default.PureComponent);
}

exports.default = ErrorWrapper;
