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

var Footer = function Footer(_ref) {
  var progress = _ref.progress,
    version = _ref.version,
    theme = _ref.theme;
  return _react2.default.createElement(
    'div',
    { className: 'col-6' },
    _react2.default.createElement(
      'div',
      { className: 'row align-items-center' },
      _react2.default.createElement(
        'div',
        { className: 'col-6 version text-truncate' },
        _react2.default.createElement(
          _bpanelUi.Text,
          { className: theme.footer.text },
          version
        )
      ),
      _react2.default.createElement(
        'div',
        { className: theme.footer.progress + ' col-6' },
        _react2.default.createElement(
          _bpanelUi.Text,
          { className: theme.footer.text },
          progress.toFixed(2),
          '% synced'
        )
      )
    )
  );
};

Footer.propTypes = {
  theme: _propTypes2.default.object,
  version: _propTypes2.default.string,
  progress: _propTypes2.default.oneOfType([
    _propTypes2.default.number,
    _propTypes2.default.string
  ])
};

exports.default = (0, _bpanelUi.widgetCreator)(connectTheme(Footer));
//# sourceMappingURL=Footer.js.map
