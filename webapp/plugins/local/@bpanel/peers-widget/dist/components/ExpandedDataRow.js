'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _reactVirtualized = require('react-virtualized');

var _bpanelUi = require('@bpanel/bpanel-ui');

var _underscore = require('underscore');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var connectTheme = _bpanelUi.utils.connectTheme; // This component can be passed to Tables (which pass it to a rowRenderer)
// it is for showing extra data in your table when you click on a row
// Data should be passed in an expandedData prop, with mainData
// being primary and having copy field functionality
// Neither are required

var cache = new _reactVirtualized.CellMeasurerCache({
  defaultWidth: 600,
  minWidth: 100,
  fixedHeight: true
});

var ExpandedDataRow = (function(_PureComponent) {
  (0, _inherits3.default)(ExpandedDataRow, _PureComponent);

  function ExpandedDataRow() {
    (0, _classCallCheck3.default)(this, ExpandedDataRow);
    return (0, _possibleConstructorReturn3.default)(
      this,
      (ExpandedDataRow.__proto__ ||
        (0, _getPrototypeOf2.default)(ExpandedDataRow)
      ).apply(this, arguments)
    );
  }

  (0, _createClass3.default)(
    ExpandedDataRow,
    [
      {
        key: 'formatExpandedData',
        value: function formatExpandedData() {
          var _props$expandedData = this.props.expandedData,
            mainData = _props$expandedData.mainData,
            subData = _props$expandedData.subData;

          var data = {
            mainData: (0, _underscore.map)(mainData, function(value, key) {
              return {
                name: key,
                value: value
              };
            }),
            subData: (0, _underscore.map)(subData, function(value, key) {
              return {
                name: key,
                value: value
              };
            })
          };
          return data;
        }
      },
      {
        key: 'cellRenderer',
        value: function cellRenderer(_ref, gridData) {
          var columnIndex = _ref.columnIndex,
            key = _ref.key,
            parent = _ref.parent,
            rowIndex = _ref.rowIndex,
            style = _ref.style;

          return _react2.default.createElement(
            _reactVirtualized.CellMeasurer,
            {
              cache: cache,
              columnIndex: columnIndex,
              key: key,
              parent: parent,
              rowIndex: rowIndex
            },
            _react2.default.createElement(
              'div',
              {
                key: key,
                style: (0, _extends3.default)({}, style, {
                  border:
                    columnIndex === 1
                      ? '1px solid rgba(255, 255, 255, 0.2)'
                      : null,
                  padding: '5px'
                })
              },
              gridData[rowIndex][columnIndex]
            )
          );
        }

        /*
     ** onCopy: Copies data inside of the respective data field.
     */
      },
      {
        key: 'onCopy',
        value: function onCopy(i) {
          var data = this['dataCol' + i];
          var textField = document.createElement('textarea');
          textField.innerText = data.innerText;
          document.body.appendChild(textField);
          textField.select();
          document.execCommand('copy');
          textField.remove();
        }
      },
      {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var theme = this.props.theme;

          var _formatExpandedData = this.formatExpandedData(),
            mainData = _formatExpandedData.mainData,
            subData = _formatExpandedData.subData;

          return _react2.default.createElement(
            'div',
            { className: theme.expandedRow.container },
            _react2.default.createElement(
              'div',
              { className: theme.expandedRow.mainDataContainer },
              mainData.map(function(data, i) {
                return _react2.default.createElement(
                  'div',
                  { className: theme.expandedRow.dataRow, key: data.name },
                  _react2.default.createElement(
                    'div',
                    { className: theme.expandedRow.rowHeader },
                    data.name
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: theme.expandedRow.borderedCol,
                      ref: function ref(dataCol) {
                        return (_this2['dataCol' + i] = dataCol);
                      }
                    },
                    data.value
                  ),
                  _react2.default.createElement('i', {
                    className: 'fa fa-copy ' + theme.expandedRow.copyIcon,
                    onClick: function onClick() {
                      return _this2.onCopy(i);
                    }
                  })
                );
              })
            ),
            _react2.default.createElement(
              'div',
              { className: theme.expandedRow.subDataContainer },
              subData.map(function(data) {
                return _react2.default.createElement(
                  'div',
                  { className: theme.expandedRow.dataRow, key: data.name },
                  _react2.default.createElement(
                    'div',
                    { className: theme.expandedRow.rowHeader },
                    data.name
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: theme.expandedRow.borderedCol },
                    data.value
                  )
                );
              })
            )
          );
        }
      }
    ],
    [
      {
        key: 'propTypes',
        get: function get() {
          return {
            colProps: _propTypes2.default.arrayOf(
              _propTypes2.default.shape({
                label: _propTypes2.default.string,
                dataKey: _propTypes2.default.string,
                width: _propTypes2.default.number
              })
            ),
            expandedData: _propTypes2.default.shape({
              mainData: _propTypes2.default.object,
              subData: _propTypes2.default.object
            }).isRequired,
            theme: _propTypes2.default.object
          };
        }
      },
      {
        key: 'defaultProps',
        get: function get() {
          return {
            style: {
              bodyStyle: {},
              containerStyle: {},
              headerStyle: {}
            }
          };
        }
      }
    ]
  );
  return ExpandedDataRow;
})(_react.PureComponent);

exports.default = connectTheme(ExpandedDataRow);
