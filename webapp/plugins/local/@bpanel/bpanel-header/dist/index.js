'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decorateHeader = exports.mapComponentState = exports.metadata = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* END IMPORTS */

/* START EXPORTS */

var metadata = (exports.metadata = {
  name: '@bpanel/bpanel-header',
  pathName: '',
  displayName: 'bPanel Header',
  author: 'bcoin-org',
  description: 'Default header for bpanel',
  version: require('../package.json').version
}); // Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
var mapComponentState = (exports.mapComponentState = {
  Header: function Header(state, map) {
    return (0, _assign2.default)(map, {
      bcoinUri: state.node.serverInfo.bcoinUri,
      loading: state.node.loading,
      network: state.node.node.network
    });
  }
});

var decorateHeader = (exports.decorateHeader = function decorateHeader(
  Header,
  _ref
) {
  var React = _ref.React,
    PropTypes = _ref.PropTypes;

  return (function(_React$PureComponent) {
    (0, _inherits3.default)(_class, _React$PureComponent);

    function _class() {
      (0, _classCallCheck3.default)(this, _class);
      return (0, _possibleConstructorReturn3.default)(
        this,
        (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).apply(
          this,
          arguments
        )
      );
    }

    (0, _createClass3.default)(
      _class,
      [
        {
          key: 'componentWillMount',
          value: function componentWillMount() {
            var _props = this.props,
              network = _props.network,
              bcoinUri = _props.bcoinUri;

            this.header = (0, _Header2.default)({
              statusIcon: 'ellipsis-h',
              bcoinUri: bcoinUri,
              network: network
            });
          }
        },
        {
          key: 'componentWillUpdate',
          value: function componentWillUpdate(_ref2) {
            var loading = _ref2.loading,
              network = _ref2.network,
              bcoinUri = _ref2.bcoinUri;

            var statusIcon = loading ? 'ellipsis-h' : 'check-circle';
            this.header = (0, _Header2.default)({
              statusIcon: statusIcon,
              bcoinUri: bcoinUri,
              network: network
            });
          }
        },
        {
          key: 'render',
          value: function render() {
            return React.createElement(
              Header,
              (0, _extends3.default)({}, this.props, {
                headerWidgets: this.header
              })
            );
          }
        }
      ],
      [
        {
          key: 'displayName',
          value: function displayName() {
            return 'bPanelHeader';
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              theme: PropTypes.object,
              network: PropTypes.string,
              loading: PropTypes.bool,
              bcoinUri: PropTypes.string
            };
          }
        }
      ]
    );
    return _class;
  })(React.PureComponent);
});
//# sourceMappingURL=index.js.map
