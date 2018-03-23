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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var Mempool = (function(_React$PureComponent) {
  (0, _inherits3.default)(Mempool, _React$PureComponent);

  function Mempool(props) {
    (0, _classCallCheck3.default)(this, Mempool);
    return (0, _possibleConstructorReturn3.default)(
      this,
      (Mempool.__proto__ || (0, _getPrototypeOf2.default)(Mempool)).call(
        this,
        props
      )
    );
  }

  (0, _createClass3.default)(
    Mempool,
    [
      {
        key: 'justKidding',
        value: function justKidding() {
          alert('Just Kidding!'); // eslint-disable-line
        }
      },
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(
            'div',
            { className: 'col-lg-4', key: 'mempool' },
            _react2.default.createElement(
              _bpanelUi.Header,
              { type: 'h5' },
              'Current Mempool'
            ),
            _react2.default.createElement(
              'p',
              null,
              'Mempool TX: ',
              this.props.mempoolTx
            ),
            _react2.default.createElement(
              'p',
              null,
              'Mempool Size: ',
              this.props.mempoolSize
            ),
            _react2.default.createElement(
              _bpanelUi.Button,
              {
                onClick: function onClick() {
                  return _this2.justKidding();
                }
              },
              'Make Transactions Cheaper'
            )
          );
        }
      }
    ],
    [
      {
        key: 'displayName',
        get: function get() {
          return 'Mempool';
        }
      },
      {
        key: 'propTypes',
        get: function get() {
          return {
            mempoolTx: _propTypes2.default.number,
            mempoolSize: _propTypes2.default.number
          };
        }
      }
    ]
  );
  return Mempool;
})(_react2.default.PureComponent); /* eslint-disable react/display-name */

exports.default = (0, _bpanelUi.widgetCreator)(Mempool);
