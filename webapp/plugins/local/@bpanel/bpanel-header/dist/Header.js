'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _bpanelUi = require('@bpanel/bpanel-ui');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var connectTheme = _bpanelUi.utils.connectTheme;

var Header = function Header(_ref) {
  var statusIcon = _ref.statusIcon,
    network = _ref.network,
    bcoinUri = _ref.bcoinUri,
    theme = _ref.theme;
  return _react2.default.createElement(
    'div',
    { className: 'container' },
    _react2.default.createElement(
      'div',
      {
        className: theme.headerbar.networkStatus + ' ml-md-auto text-right col'
      },
      _react2.default.createElement(
        'div',
        { className: 'network text-uppercase' },
        _react2.default.createElement(
          _bpanelUi.Text,
          { className: theme.headerbar.text },
          'Status: ',
          network,
          ' '
        ),
        _react2.default.createElement('i', {
          className: theme.headerbar.icon + ' fa fa-' + statusIcon,
          areahidden: 'true'
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'node' },
        _react2.default.createElement(
          _bpanelUi.Text,
          { className: theme.headerbar.nodeText + ' ' + theme.headerbar.text },
          'Node:',
          ' '
        ),
        _react2.default.createElement(
          _bpanelUi.Text,
          { className: '' + theme.headerbar.text },
          bcoinUri
        )
      )
    )
  );
};

Header.propTypes = {
  theme: _propTypes2.default.object,
  network: _propTypes2.default.string,
  statusIcon: _propTypes2.default.string,
  bcoinUri: _propTypes2.default.string
};
exports.default = (0, _bpanelUi.widgetCreator)(connectTheme(Header));
//# sourceMappingURL=Header.js.map
