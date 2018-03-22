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

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bpanelUi = require('@bpanel/bpanel-ui');

var _ExpandedRow = require('./ExpandedRow');

var _ExpandedRow2 = _interopRequireDefault(_ExpandedRow);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Dashboard = (function(_Component) {
  (0, _inherits3.default)(Dashboard, _Component);

  function Dashboard(props) {
    (0, _classCallCheck3.default)(this, Dashboard);

    // only want to do the recent block call once on mount
    // or on update when route changes
    // for other new blocks, we use the socket
    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (Dashboard.__proto__ || (0, _getPrototypeOf2.default)(Dashboard)).call(
        this,
        props
      )
    );

    _this.callingRecentBlocks = false;
    return _this;
  }

  (0, _createClass3.default)(
    Dashboard,
    [
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _props = this.props,
            chainHeight = _props.chainHeight,
            getRecentBlocks = _props.getRecentBlocks;

          if (chainHeight > 0 && !this.callingRecentBlocks) {
            this.callingRecentBlocks = true;
            getRecentBlocks(10);
          }
        }
      },
      {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.callingRecentBlocks = false;
        }
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
          var _props2 = this.props,
            chainHeight = _props2.chainHeight,
            _props2$recentBlocks = _props2.recentBlocks,
            recentBlocks =
              _props2$recentBlocks === undefined ? [] : _props2$recentBlocks,
            getRecentBlocks = _props2.getRecentBlocks;

          // if chainHeight has increased and recentBlocks is not set,
          // get the most recent blocks
          // `getRecentBlocks` are attached to the store
          // and will dispatch action creators to udpate the state

          if (
            prevProps.chainHeight &&
            prevProps.chainHeight >= chainHeight &&
            !recentBlocks.length &&
            !this.callingRecentBlocks
          ) {
            getRecentBlocks(10);
            this.callingRecentBlocks = true;
          }
        }
      },
      {
        key: 'render',
        value: function render() {
          var recentBlocks = this.props.recentBlocks;

          var table = void 0;
          if (Array.isArray(recentBlocks) && recentBlocks.length) {
            table = _react2.default.createElement(_bpanelUi.Table, {
              ExpandedComponent: _ExpandedRow2.default,
              expandedHeight: 240,
              tableData: recentBlocks
            });
          } else {
            table = _react2.default.createElement('p', null, 'Loading...');
          }

          return _react2.default.createElement(
            'div',
            { className: 'recent-blocks' },
            table
          );
        }
      }
    ],
    [
      {
        key: 'propTypes',
        get: function get() {
          return {
            chainHeight: _propTypes2.default.number,
            recentBlocks: _propTypes2.default.array,
            getRecentBlocks: _propTypes2.default.func
          };
        }
      }
    ]
  );
  return Dashboard;
})(_react.Component);

exports.default = Dashboard;
