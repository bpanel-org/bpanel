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

var _RecentBlocksTable = require('./RecentBlocksTable');

var _RecentBlocksTable2 = _interopRequireDefault(_RecentBlocksTable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var RecentBlocks = (function(_React$PureComponent) {
  (0, _inherits3.default)(RecentBlocks, _React$PureComponent);

  function RecentBlocks(props) {
    (0, _classCallCheck3.default)(this, RecentBlocks);
    return (0, _possibleConstructorReturn3.default)(
      this,
      (RecentBlocks.__proto__ || (0, _getPrototypeOf2.default)(RecentBlocks)
      ).call(this, props)
    );
  }

  (0, _createClass3.default)(
    RecentBlocks,
    [
      {
        key: 'render',
        value: function render() {
          var getRecentBlocks = this.props.getRecentBlocks;

          return _react2.default.createElement(
            'div',
            { className: 'col' },
            _react2.default.createElement(
              _bpanelUi.Header,
              { type: 'h3' },
              'Recent Blocks'
            ),
            _react2.default.createElement(
              _RecentBlocksTable2.default,
              this.props
            ),
            _react2.default.createElement(
              _bpanelUi.Button,
              {
                onClick: function onClick() {
                  return getRecentBlocks(10);
                }
              },
              'Get Blocks'
            )
          );
        }
      }
    ],
    [
      {
        key: 'displayName',
        get: function get() {
          return 'Recent Blocks Widget';
        }
      },
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
  return RecentBlocks;
})(_react2.default.PureComponent);

exports.default = (0, _bpanelUi.widgetCreator)(RecentBlocks);
