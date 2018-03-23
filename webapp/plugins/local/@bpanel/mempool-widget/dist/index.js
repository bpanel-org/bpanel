'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decoratePlugin = exports.middleware = exports.getRouteProps = exports.reduceNode = exports.addSocketConstants = exports.mapComponentState = exports.metadata = undefined;

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

var _constants = require('./constants');

var _actions = require('./actions');

var _Mempool = require('./components/Mempool');

var _Mempool2 = _interopRequireDefault(_Mempool);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var metadata = (exports.metadata = {
  name: 'mempool',
  author: 'bcoin-org'
}); // Dashboard widget for showing mempool information
var mapComponentState = (exports.mapComponentState = {
  Panel: function Panel(state, map) {
    return (0, _assign2.default)(map, {
      mempoolTx: state.node.mempool.tx,
      mempoolSize: state.node.mempool.size
    });
  }
});

var addSocketConstants = (exports.addSocketConstants = function addSocketConstants() {
  var sockets =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : { listeners: [] };

  sockets.listeners.push(
    {
      event: 'update mempool',
      actionType: _constants.UPDATE_MEMPOOL
    },
    {
      event: 'mempool tx',
      actionType: _constants.MEMPOOL_TX
    }
  );
  return (0, _assign2.default)(sockets, {
    socketListeners: sockets.listeners
  });
});

var reduceNode = (exports.reduceNode = function reduceNode(state, action) {
  var type = action.type,
    payload = action.payload;

  switch (type) {
    case _constants.UPDATE_MEMPOOL: {
      var tx = payload.tx,
        size = payload.size;

      var currentTx = state.getIn('tx');
      var currentSize = state.getIn('size');

      if (tx !== currentTx && size !== currentSize) {
        return state.set('mempool', payload);
      }
      break;
    }

    default:
      return state;
  }
});

var getRouteProps = (exports.getRouteProps = {
  '@bpanel/dashboard': function bpanelDashboard(parentProps, props) {
    return (0, _assign2.default)(props, {
      mempoolTx: parentProps.mempoolTx,
      mempoolSize: parentProps.mempoolSize
    });
  }
});

var debounceInterval = 1000;
var deboucer = null;
var middleware = (exports.middleware = function middleware(_ref) {
  var dispatch = _ref.dispatch;
  return function(next) {
    return function(action) {
      var type = action.type;

      if (type === _constants.SOCKET_CONNECTED) {
        // actions to dispatch when the socket has connected
        // these are broadcasts and subscriptions we want to make
        // to the bcoin node
        dispatch((0, _actions.watchMempool)());
        dispatch((0, _actions.broadcastSetFilter)());
        dispatch((0, _actions.subscribeTX)());
      } else if (
        type === _constants.MEMPOOL_TX ||
        type === _constants.ADD_RECENT_BLOCK
      ) {
        if (deboucer) return next(action);
        // update mempool state if new tx in pool or we got a new block
        dispatch((0, _actions.updateMempool)());
        deboucer = setTimeout(function() {
          deboucer = null;
        }, debounceInterval);
      }
      return next(action);
    };
  };
});

// very/exactly similar to normal decorators
// name can be anything, but must match it to target
// plugin name via decoratePlugin export below
var decorateDashboard = function decorateDashboard(Dashboard, _ref2) {
  var React = _ref2.React,
    PropTypes = _ref2.PropTypes;

  return (function(_React$Component) {
    (0, _inherits3.default)(_class, _React$Component);

    function _class(props) {
      (0, _classCallCheck3.default)(this, _class);
      return (0, _possibleConstructorReturn3.default)(
        this,
        (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).call(
          this,
          props
        )
      );
    }

    (0, _createClass3.default)(
      _class,
      [
        {
          key: 'componentDidUpdate',

          // componentWillMount() {
          //   const { mempoolSize, mempoolTx } = this.props;
          //   this.mempoolWidget = Mempool({ mempoolTx, mempoolSize });
          // }

          value: function componentDidUpdate(prevProps) {
            var prevTx = prevProps.mempoolTx,
              prevSize = prevProps.mempoolSize;
            var _props = this.props,
              mempoolTx = _props.mempoolTx,
              mempoolSize = _props.mempoolSize;

            if (
              prevTx !== this.props.mempoolTx ||
              prevSize !== this.props.mempoolSize
            )
              this.mempoolWidget = (0, _Mempool2.default)({
                mempoolSize: mempoolSize,
                mempoolTx: mempoolTx
              });
          }
        },
        {
          key: 'render',
          value: function render() {
            var _props2 = this.props,
              _props2$bottomWidgets = _props2.bottomWidgets,
              bottomWidgets =
                _props2$bottomWidgets === undefined
                  ? []
                  : _props2$bottomWidgets,
              mempoolSize = _props2.mempoolSize,
              mempoolTx = _props2.mempoolTx;

            bottomWidgets.push(
              (0, _Mempool2.default)({
                mempoolSize: mempoolSize,
                mempoolTx: mempoolTx
              })
            );
            // bottomWidgets.push(this.mempoolWidget);
            return React.createElement(
              Dashboard,
              (0, _extends3.default)({}, this.props, {
                bottomWidgets: bottomWidgets
              })
            );
          }
        }
      ],
      [
        {
          key: 'displayName',
          value: function displayName() {
            return 'Mempool Widget';
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              bottomWidgets: PropTypes.array,
              mempoolTx: PropTypes.number,
              mempoolSize: PropTypes.number
            };
          }
        },
        {
          key: 'defaultProps',
          get: function get() {
            return {
              mempoolTx: 0,
              mempoolSize: 0
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
