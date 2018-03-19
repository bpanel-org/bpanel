'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decoratePlugin = exports.pluginConfig = exports.metadata = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _bpanelUi = require('@bpanel/bpanel-ui');

var _bpanelUtils = require('@bpanel/bpanel-utils');

var _underscore = require('underscore');

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _PeersList = require('./components/PeersList');

var _PeersList2 = _interopRequireDefault(_PeersList);

var _PeersMap = require('./components/PeersMap');

var _PeersMap2 = _interopRequireDefault(_PeersMap);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/* END IMPORTS */

// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
var plugins = (0, _keys2.default)(_plugins2.default).map(function(name) {
  return _plugins2.default[name];
});

/* START EXPORTS */

var metadata = (exports.metadata = {
  name: '@bpanel/peers-widget',
  pathName: '',
  displayName: 'Peers',
  author: 'bcoin-org',
  description:
    'A widget for displaying peer information on the bPanel Dashboard',
  version: require('../package.json').version
});

var pluginConfig = (exports.pluginConfig = { plugins: plugins });

var decorateDashboard = function decorateDashboard(Dashboard, _ref) {
  var React = _ref.React,
    PropTypes = _ref.PropTypes;

  return (function(_React$Component) {
    (0, _inherits3.default)(_class, _React$Component);

    function _class(props) {
      (0, _classCallCheck3.default)(this, _class);

      var _this = (0, _possibleConstructorReturn3.default)(
        this,
        (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(
          this,
          props
        )
      );

      _this.client = (0, _bpanelUtils.bpanelClient)();
      _this.state = {
        peers: []
      };
      return _this;
    }

    (0, _createClass3.default)(
      _class,
      [
        {
          key: 'componentDidMount',
          value: (function() {
            var _ref2 = (0, _asyncToGenerator3.default)(
              /*#__PURE__*/ _regenerator2.default.mark(function _callee() {
                var peersList, peers;
                return _regenerator2.default.wrap(
                  function _callee$(_context) {
                    while (1) {
                      switch ((_context.prev = _context.next)) {
                        case 0:
                          this._isMounted = true;
                          _context.next = 3;
                          return this.client.execute('getpeerinfo');

                        case 3:
                          peersList = _context.sent;
                          peers = peersList.map(function(peer) {
                            return (0, _underscore.chain)(peer)
                              .pick(function(value, key) {
                                var keys = [
                                  'id',
                                  'addr',
                                  'name',
                                  'subver',
                                  'inbound',
                                  'relaytxes'
                                ];
                                if (keys.indexOf(key) > -1) return true;
                              })
                              .mapObject(function(value) {
                                // for boolean values need to convert to a string
                                if (typeof value === 'boolean')
                                  return value.toString();
                                return value;
                              })
                              .value();
                          });

                          this.setState({ peers: peers });

                        case 6:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  },
                  _callee,
                  this
                );
              })
            );

            function componentDidMount() {
              return _ref2.apply(this, arguments);
            }

            return componentDidMount;
          })()
        },
        {
          key: 'render',
          value: function render() {
            var peers = this.state.peers;
            var _props$bottomWidgets = this.props.bottomWidgets,
              bottomWidgets =
                _props$bottomWidgets === undefined ? [] : _props$bottomWidgets;
            // widget to display table of peers

            var Peers = function Peers() {
              return React.createElement(
                'div',
                { className: 'col-lg-8' },
                React.createElement(
                  _bpanelUi.Header,
                  { type: 'h5' },
                  'Peers List'
                ),
                React.createElement(_PeersList2.default, { peers: peers })
              );
            };
            bottomWidgets.push(Peers);

            // Widget for displaying a map with the peer locations
            var customChildrenAfter = React.createElement(
              'div',
              { className: 'col', style: { height: '500px', width: '100%' } },
              React.createElement(_PeersMap2.default, { peers: peers }),
              this.props.customChildrenAfter
            );

            return React.createElement(
              Dashboard,
              (0, _extends3.default)({}, this.props, {
                bottomWidgets: bottomWidgets,
                customChildrenAfter: customChildrenAfter
              })
            );
          }
        }
      ],
      [
        {
          key: 'displayName',
          get: function get() {
            return 'Peers Widgets';
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              bottomWidgets: PropTypes.array,
              customChildrenAfter: PropTypes.node
            };
          }
        }
      ]
    );
    return _class;
  })(React.Component);
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate. Must match target plugin name exactly
var decoratePlugin = (exports.decoratePlugin = {
  '@bpanel/dashboard': decorateDashboard
});

/* END EXPORTS */
