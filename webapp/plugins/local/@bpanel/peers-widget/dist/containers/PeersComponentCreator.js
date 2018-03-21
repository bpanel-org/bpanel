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

var _bpanelUi = require('@bpanel/bpanel-ui');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var PeerComponentCreator = function PeerComponentCreator(Component_) {
  var peers =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
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
          key: 'render',
          value: function render() {
            if (peers.length > 0)
              return _react2.default.createElement(Component_, {
                peers: peers
              });

            return _react2.default.createElement(
              _bpanelUi.Text,
              { type: 'p' },
              'Loading Peers...'
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
  })(_react2.default.Component);
};

exports.default = PeerComponentCreator;
