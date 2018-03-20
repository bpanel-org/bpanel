'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decoratePlugin = exports.mapComponentState = exports.mapComponentDispatch = exports.getRouteProps = exports.reduceNode = exports.pluginConfig = exports.metadata = undefined;

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

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _bpanelUi = require('@bpanel/bpanel-ui');

var _bpanelUtils = require('@bpanel/bpanel-utils');

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _actions = require('./actions');

var _constants = require('./constants');

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

var reduceNode = (exports.reduceNode = function reduceNode(state, action) {
  var type = action.type,
    payload = action.payload;

  switch (type) {
    case _constants.SET_PEERS: {
      (0, _assert2.default)(
        Array.isArray(payload),
        'Payload for SET_PEERS must be array'
      );
      return state.set('peers', payload);
    }

    default:
      return state;
  }
});

var getRouteProps = (exports.getRouteProps = {
  '@bpanel/dashboard': function bpanelDashboard(parentProps, props) {
    return (0, _assign2.default)(props, {
      peers: parentProps.peers,
      getPeers: parentProps.getPeers
    });
  }
});

var mapComponentDispatch = (exports.mapComponentDispatch = {
  Panel: function Panel(dispatch, map) {
    return (0, _assign2.default)(map, {
      getPeers: function getPeers() {
        return dispatch((0, _actions.getPeers)());
      }
    });
  }
});

var mapComponentState = (exports.mapComponentState = {
  Panel: function Panel(state, map) {
    return (0, _assign2.default)(map, {
      peers: state.node.peers
    });
  }
});

var decorateDashboard = function decorateDashboard(Dashboard, _ref) {
  var React = _ref.React,
    PropTypes = _ref.PropTypes;

  // This way of creating the widgets is to help avoid re-renders
  // if another widget has props/state update
  var PeerListCreator = function PeerListCreator() {
    var peers =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
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
            key: 'render',
            value: function render() {
              var peerList = void 0;
              if (peers.length > 0) {
                peerList = React.createElement(_PeersList2.default, {
                  peers: peers
                });
              } else {
                React.createElement(
                  _bpanelUi.Text,
                  { type: 'p' },
                  'Loading Peers...'
                );
              }
              return React.createElement(
                'div',
                { className: 'col-lg-8' },
                React.createElement(
                  _bpanelUi.Header,
                  { type: 'h5' },
                  'Peers List'
                ),
                peerList
              );
            }
          }
        ],
        [
          {
            key: 'displayName',
            value: function displayName() {
              return 'Peers List';
            }
          }
        ]
      );
      return _class;
    })(React.PureComponent);
  };

  return (function(_React$Component) {
    (0, _inherits3.default)(_class2, _React$Component);

    function _class2(props) {
      (0, _classCallCheck3.default)(this, _class2);

      var _this2 = (0, _possibleConstructorReturn3.default)(
        this,
        (_class2.__proto__ || (0, _getPrototypeOf2.default)(_class2)).call(
          this,
          props
        )
      );

      _this2.client = (0, _bpanelUtils.bpanelClient)();
      _this2.peersList = PeerListCreator();
      return _this2;
    }

    (0, _createClass3.default)(
      _class2,
      [
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            this.props.getPeers();
            this.peersList = PeerListCreator(this.props.peers);
          }
        },
        {
          key: 'componentWillUpdate',
          value: function componentWillUpdate(_ref2) {
            var peers = _ref2.peers;

            if (peers.length > 0 && peers[0] !== this.props.peers[0])
              this.peersList = PeerListCreator(peers);
          }
        },
        {
          key: 'render',
          value: function render() {
            var _props = this.props,
              _props$bottomWidgets = _props.bottomWidgets,
              bottomWidgets =
                _props$bottomWidgets === undefined ? [] : _props$bottomWidgets,
              peers = _props.peers;
            // widget to display table of peers

            bottomWidgets.push(this.peersList);

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
          value: function displayName() {
            return 'Peers Widgets';
          }
        },
        {
          key: 'defaultProps',
          get: function get() {
            return {
              peers: []
            };
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              bottomWidgets: PropTypes.array,
              customChildrenAfter: PropTypes.node,
              peers: PropTypes.arrayOf(PropTypes.object),
              getPeers: PropTypes.func.isRequired
            };
          }
        }
      ]
    );
    return _class2;
  })(React.Component);
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate. Must match target plugin name exactly
var decoratePlugin = (exports.decoratePlugin = {
  '@bpanel/dashboard': decorateDashboard
});

/* END EXPORTS */
