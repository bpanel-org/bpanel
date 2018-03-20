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

var _selectors = require('../selectors');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _class = (function(_PureComponent) {
  (0, _inherits3.default)(_class, _PureComponent);

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
        key: 'render',
        value: function render() {
          var peers = this.props.peers;

          var table = void 0;
          if (Array.isArray(peers) && peers.length) {
            var data = _selectors.peers.peerTableData(peers);
            var expandedData = data.map(function(peer) {
              return {
                mainData: (0, _underscore.pick)(peer, [
                  'addr',
                  'name',
                  'subver'
                ])
              };
            });
            table = _react2.default.createElement(_bpanelUi.Table, {
              tableData: data,
              expandedData: expandedData,
              ExpandedComponent: _bpanelUi.ExpandedDataRow,
              expandedHeight: 200
            });
          } else {
            table = _react2.default.createElement(
              _bpanelUi.Text,
              { type: 'p' },
              'Loading peers...'
            );
          }

          return _react2.default.createElement(
            'div',
            { className: 'peers-list' },
            table
          );
        }
      }
    ],
    [
      {
        key: 'displayName',
        get: function get() {
          return 'Peers List';
        }
      },
      {
        key: 'propTypes',
        get: function get() {
          return {
            peers: _propTypes2.default.arrayOf(_propTypes2.default.object)
          };
        }
      }
    ]
  );
  return _class;
})(_react.PureComponent);

exports.default = _class;
