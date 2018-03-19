'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bpanelUi = require('@bpanel/bpanel-ui');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var connectTheme = _bpanelUi.utils.connectTheme,
  makeRem = _bpanelUi.utils.makeRem;

var markerStyle = {
  color: 'white',
  width: '20px',
  height: '20px',
  paddingTop: '3px',
  textAlign: 'center',
  borderRadius: '21px'
};
var Marker = function Marker(_ref) {
  var id = _ref.id,
    _ref$theme$themeVaria = _ref.theme.themeVariables,
    highlight1 = _ref$theme$themeVaria.themeColors.highlight1,
    fontSizeSmall = _ref$theme$themeVaria.rawRem.fontSizeSmall;

  var fontSize = makeRem(fontSizeSmall);

  return _react2.default.createElement(
    _bpanelUi.Text,
    {
      type: 'p',
      style: (0, _extends3.default)({}, markerStyle, {
        backgroundColor: highlight1,
        fontSize: fontSize
      })
    },
    id
  );
};

Marker.propTypes = {
  id: _propTypes2.default.number,
  theme: _propTypes2.default.object
};

exports.default = connectTheme(Marker);
