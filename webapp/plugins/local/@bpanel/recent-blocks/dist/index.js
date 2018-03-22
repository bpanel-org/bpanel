'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.decoratePlugin = exports.reduceChain = exports.middleware = exports.mapComponentState = exports.mapComponentDispatch = exports.getRouteProps = exports.pluginConfig = exports.metadata = undefined;

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

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _seamlessImmutable = require('seamless-immutable');

var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _RecentBlocks = require('./components/RecentBlocks');

var _RecentBlocks2 = _interopRequireDefault(_RecentBlocks);

var _actions = require('./actions');

var _constants = require('./constants');

var _selectors = require('./selectors');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Entry point for your plugin
// This should expose your plugin's modules
/* START IMPORTS */
var getBlocksWithTxCount = _selectors.recentBlocks.getBlocksWithTxCount;
/* END IMPORTS */

var plugins = (0, _keys2.default)(_plugins2.default).map(function(name) {
  return _plugins2.default[name];
});

/* START EXPORTS */

var metadata = (exports.metadata = {
  name: '@bpanel/recent-blocks',
  pathName: '',
  displayName: 'Recent Blocks',
  author: 'bcoin-org',
  description:
    'A widget that shows the recent block information with expandable rows, optimized for bpanel dashboard',
  version: require('../package.json').version
});

var pluginConfig = (exports.pluginConfig = { plugins: plugins });

var getRouteProps = (exports.getRouteProps = {
  '@bpanel/dashboard': function bpanelDashboard(parentProps, props) {
    return (0, _assign2.default)(props, {
      chainHeight: parentProps.chainHeight,
      recentBlocks: parentProps.recentBlocks,
      getRecentBlocks: parentProps.getRecentBlocks
    });
  }
});

// This connects your plugin's component to the state's dispatcher
// Make sure to pass in an actual action to the dispatcher
var mapComponentDispatch = (exports.mapComponentDispatch = {
  Panel: function Panel(dispatch, map) {
    return (0, _assign2.default)(map, {
      getRecentBlocks: function getRecentBlocks() {
        var n =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : 10;
        return dispatch((0, _actions.getRecentBlocks)(n));
      }
    });
  }
});

// Tells the decorator what our plugin needs from the state
// This is available for container components that use an
// extended version of react-redux's connect to connect
// a container to the state and retrieve props
// make sure to replace the corresponding state mapping
// (e.g. `state.chain.height`) and prop names
var mapComponentState = (exports.mapComponentState = {
  Panel: function Panel(state, map) {
    return (0, _assign2.default)(map, {
      chainHeight: state.chain.height,
      recentBlocks: state.chain.recentBlocks ? getBlocksWithTxCount(state) : []
    });
  }
});

// custom middleware for our plugin. This gets
// added to the list of middlewares in the app's store creator
// Use this to intercept and act on dispatched actions
// e.g. for responding to socket events
var middleware = (exports.middleware = function middleware(_ref) {
  var dispatch = _ref.dispatch,
    getState = _ref.getState;
  return function(next) {
    return function(action) {
      var type = action.type,
        payload = action.payload;
      var _getState$chain = getState().chain,
        recentBlocks = _getState$chain.recentBlocks,
        progress = _getState$chain.progress;

      if (
        type === _constants.ADD_NEW_BLOCK &&
        recentBlocks &&
        recentBlocks.length &&
        progress > 0.9
      ) {
        // if dispatched action is ADD_NEW_BLOCK,
        // and recent blocks are already loaded
        // this middleware will intercept and dispatch addRecentBlock
        dispatch(
          _actions.addRecentBlock.apply(
            undefined,
            (0, _toConsumableArray3.default)(payload)
          )
        );
      }
      return next(action);
    };
  };
});

// decorator for the chain reducer
// this will extend the current chain reducer
// make sure to replace the constants
// and prop names with your actual targets
// NOTE: state uses `seamless-immutable` to ensure immutability
// See their API Docs for more details (e.g. `set`)
// https://www.npmjs.com/package/seamless-immutable
var reduceChain = (exports.reduceChain = function reduceChain(state, action) {
  var type = action.type,
    payload = action.payload;

  switch (type) {
    case _constants.SET_RECENT_BLOCKS: {
      if (payload.length)
        return state.set(
          'recentBlocks',
          (0, _seamlessImmutable2.default)(payload),
          { deep: true }
        );
      break;
    }

    case _constants.ADD_RECENT_BLOCK: {
      var block = payload;
      var numBlocks = 10;
      var blocks = state.getIn(['recentBlocks']);
      var newBlocks = [].concat((0, _toConsumableArray3.default)(blocks)); // get mutable version of blocks

      // skip if the height of new block is same as top block
      // or recentBlocks haven't been hydrated yet
      // reason is new block can be received multiple times
      if (blocks && blocks.length && block.height !== blocks[0].height) {
        newBlocks.unshift(block);
        // check if action includes a length to limit recent blocks list to
        if (numBlocks && state.recentBlocks.length >= numBlocks) {
          newBlocks.pop();
        }
      }

      return state.merge({
        recentBlocks: (0, _seamlessImmutable2.default)(newBlocks)
      });
    }

    default:
      return state;
  }
});

// very/exactly similar to normal decorators
// name can be anything, but must match it to target
// plugin name via decoratePlugin export below
var decorateDashboard = function decorateDashboard(Dashboard, _ref2) {
  var React = _ref2.React,
    PropTypes = _ref2.PropTypes;

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

      var getRecentBlocks = props.getRecentBlocks,
        chainHeight = props.chainHeight,
        recentBlocks = props.recentBlocks;

      _this.recentBlocks = (0, _RecentBlocks2.default)({
        getRecentBlocks: getRecentBlocks,
        chainHeight: chainHeight,
        recentBlocks: recentBlocks
      });
      return _this;
    }

    (0, _createClass3.default)(
      _class,
      [
        {
          key: 'componentDidUpdate',
          value: function componentDidUpdate(_ref3) {
            var prevHeight = _ref3.chainHeight,
              prevBlocks = _ref3.recentBlocks;
            var _props = this.props,
              chainHeight = _props.chainHeight,
              recentBlocks = _props.recentBlocks,
              getRecentBlocks = _props.getRecentBlocks;

            if (
              chainHeight > prevHeight ||
              !prevBlocks.length ||
              (prevBlocks[0] &&
                recentBlocks[0] &&
                prevBlocks[0].hash !== recentBlocks[0].hash)
            ) {
              this.recentBlocks = (0, _RecentBlocks2.default)({
                chainHeight: chainHeight,
                recentBlocks: recentBlocks,
                getRecentBlocks: getRecentBlocks
              });
            }
          }
        },
        {
          key: 'render',
          value: function render() {
            var _props$primaryWidget = this.props.primaryWidget,
              primaryWidget =
                _props$primaryWidget === undefined ? [] : _props$primaryWidget;

            primaryWidget.push(this.recentBlocks);
            return React.createElement(
              Dashboard,
              (0, _extends3.default)({}, this.props, {
                primaryWidget: primaryWidget
              })
            );
          }
        }
      ],
      [
        {
          key: 'displayName',
          get: function get() {
            return metadata.displayName;
          }
        },
        {
          key: 'propTypes',
          get: function get() {
            return {
              primaryWidget: PropTypes.oneOf([PropTypes.array, PropTypes.node]),
              chainHeight: PropTypes.number,
              recentBlocks: PropTypes.array,
              getRecentBlocks: PropTypes.func
            };
          }
        }
      ]
    );
    return _class;
  })(React.PureComponent);
};

// `decoratePlugin` passes an object with properties to map to the
// plugins they will decorate. Must match target plugin name exactly
var decoratePlugin = (exports.decoratePlugin = {
  '@bpanel/dashboard': decorateDashboard
});

/* END EXPORTS */
