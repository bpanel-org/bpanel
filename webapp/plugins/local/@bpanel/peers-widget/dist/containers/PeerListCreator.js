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

var _PeersList = require('../components/PeersList');

var _PeersList2 = _interopRequireDefault(_PeersList);

var _ErrorWrapper = require('../components/ErrorWrapper');

var _ErrorWrapper2 = _interopRequireDefault(_ErrorWrapper);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var PeersListCreator = function PeersListCreator() {
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
              peerList = _react2.default.createElement(_PeersList2.default, {
                peers: peers
              });
            } else {
              _react2.default.createElement(
                _bpanelUi.Text,
                { type: 'p' },
                'Loading Peers...'
              );
            }
            return _react2.default.createElement(
              'div',
              { className: 'col-lg-8' },
              _react2.default.createElement(
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
  })(_react2.default.PureComponent);
};

exports.default = (0, _ErrorWrapper2.default)(PeersListCreator);
