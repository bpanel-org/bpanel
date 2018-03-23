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

var _underscore = require('underscore');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var RecentBlocks = (function(_React$Component) {
  (0, _inherits3.default)(RecentBlocks, _React$Component);

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
          var _props = this.props,
            getRecentBlocks = _props.getRecentBlocks,
            recentBlocks = _props.recentBlocks,
            progress = _props.progress;
          // use this to ensure order of columns
          // otherwise table just uses object keys

          var colHeaders = [
            'depth',
            'height',
            'hash',
            'version',
            'prevBlock',
            'merkleRoot',
            'time',
            'bits',
            'nonce',
            'txs'
          ];

          var table = void 0,
            button = void 0;
          if (Array.isArray(recentBlocks) && recentBlocks.length) {
            // structure data for use in the expanded row component
            var expandedData = recentBlocks.map(function(block) {
              return {
                mainData: (0, _underscore.pick)(block, [
                  'hash',
                  'prevBlock',
                  'merkleRoot'
                ]),
                subData: (0, _underscore.pick)(block, [
                  'bits',
                  'nonce',
                  'version'
                ])
              };
            });
            table = _react2.default.createElement(_bpanelUi.Table, {
              colHeaders: colHeaders,
              ExpandedComponent: _bpanelUi.ExpandedDataRow,
              expandedData: expandedData,
              expandedHeight: 240,
              tableData: recentBlocks
            });
          } else {
            table = _react2.default.createElement('p', null, 'Loading...');
          }
          if (progress < 1) {
            button = _react2.default.createElement(
              'div',
              { className: 'row mt-3' },
              _react2.default.createElement(
                _bpanelUi.Text,
                { type: 'p', className: 'col' },
                'While your node is syncing you can use this Button to get more recent blocks as they come in. Once your node is at 100% this button will go away and the table will update automatically'
              ),
              _react2.default.createElement(
                _bpanelUi.Button,
                {
                  type: 'primary',
                  className: 'col-xl-3',
                  onClick: function onClick() {
                    return getRecentBlocks(10);
                  }
                },
                'Get Blocks'
              )
            );
          }
          return _react2.default.createElement(
            'div',
            { className: 'col' },
            _react2.default.createElement(
              _bpanelUi.Header,
              { type: 'h3' },
              'Recent Blocks'
            ),
            table,
            button
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
            getRecentBlocks: _propTypes2.default.func,
            progress: _propTypes2.default.number
          };
        }
      }
    ]
  );
  return RecentBlocks;
})(_react2.default.Component);

exports.default = (0, _bpanelUi.widgetCreator)(RecentBlocks);
