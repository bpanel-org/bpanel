'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.mapComponentState = exports.decorateFooter = exports.metadata = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* END IMPORTS */

/* START EXPORTS */

var metadata = (exports.metadata = {
  name: '@bpanel/bpanel-footer',
  pathName: '',
  displayName: 'bPanel Footer',
  author: 'bcoin-org',
  description:
    'A simple footer to display chain sync progress and bcoin version',
  version: require('../package.json').version
});

// Decorate a target component (e.g. Footer, Header, Sidebar)
// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
var decorateFooter = (exports.decorateFooter = function decorateFooter(
  Footer,
  _ref
) {
  var React = _ref.React,
    PropTypes = _ref.PropTypes;

  return (function(_React$PureComponent) {
    (0, _inherits3.default)(_class, _React$PureComponent);

    function _class(props) {
      (0, _classCallCheck3.default)(this, _class);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(
          this,
          props
        )
      );

      _this.footer = React.createElement('div');
      return _this;
    }

    (0, _createClass3.default)(
      _class,
      [
        {
          key: 'componentWillMount',
          value: function componentWillMount() {
            var _props = this.props,
              progress = _props.progress,
              version = _props.version,
              existingCustomChildren = _props.customChildren;

            var progressPercentage = progress * 100;
            this.footer = React.createElement(_Footer2.default, {
              progress: progressPercentage,
              version: version,
              customChildren: existingCustomChildren
            });
          }
        },
        {
          key: 'componentWillUpdate',
          value: function componentWillUpdate(_ref2) {
            var nextProgress = _ref2.progress,
              version = _ref2.version;
            var _props2 = this.props,
              progress = _props2.progress,
              existingCustomChildren = _props2.customChildren;

            var progressPercentage = nextProgress * 100;

            if (nextProgress > progress) {
              this.footer = React.createElement(_Footer2.default, {
                progress: progressPercentage,
                version: version,
                customChildren: existingCustomChildren
              });
            }
          }
        },
        {
          key: 'render',
          value: function render() {
            return React.createElement(
              Footer,
              (0, _extends3.default)({}, this.props, {
                customChildren: this.footer
              })
            );
          }
        }
      ],
      [
        {
          key: 'displayName',
          value: function displayName() {
            return metadata.name;
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              theme: PropTypes.object,
              version: PropTypes.string,
              progress: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
              ]),
              customChildren: PropTypes.node
            };
          }
        }
      ]
    );
    return _class;
  })(React.PureComponent);
});

// Tells the decorator what our plugin needs from the state
// This is available for container components that use an
// extended version of react-redux's connect to connect
// a container to the state and retrieve props
// make sure to replace the corresponding state mapping
// (e.g. `state.chain.height`) and prop names
var mapComponentState = (exports.mapComponentState = {
  Footer: function Footer(state, map) {
    return (0, _assign2.default)(map, {
      version: state.node.node.version,
      progress: state.chain.progress
    });
  }
});

/* END EXPORTS */
