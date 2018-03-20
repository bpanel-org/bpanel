'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _peers = require('../selectors/peers');

var _reactGmaps = require('react-gmaps');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var params = { v: '3.exp', key: 'AIzaSyAt-64SBzyt3H3crm-C8xv010ns30J4J2c' };

var GoogleMap = (function(_React$Component) {
  (0, _inherits3.default)(GoogleMap, _React$Component);

  function GoogleMap(props) {
    (0, _classCallCheck3.default)(this, GoogleMap);

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (GoogleMap.__proto__ || (0, _getPrototypeOf2.default)(GoogleMap)).call(
        this,
        props
      )
    );

    _this.center = {
      lat: 51.5258541,
      lng: -0.08040660000006028
    };
    _this.state = { coordinates: [] };
    return _this;
  }

  (0, _createClass3.default)(
    GoogleMap,
    [
      {
        key: 'componentWillReceiveProps',
        value: (function() {
          var _ref = (0, _asyncToGenerator3.default)(
            /*#__PURE__*/ _regenerator2.default.mark(function _callee(
              nextProps
            ) {
              var peers, coordinates;
              return _regenerator2.default.wrap(
                function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        if (
                          !(
                            this.props.peers &&
                            this.props.peers[0] === nextProps.peers[0]
                          )
                        ) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt('return');

                      case 2:
                        peers = nextProps.peers;

                        if (!peers.length) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 6;
                        return (0, _peers.getPeerCoordinates)(peers);

                      case 6:
                        coordinates = _context.sent;

                        this.setState({ coordinates: coordinates });

                      case 8:
                      case 'end':
                        return _context.stop();
                    }
                  }
                },
                _callee,
                this
              );
            })
          );

          function componentWillReceiveProps(_x) {
            return _ref.apply(this, arguments);
          }

          return componentWillReceiveProps;
        })()
      },
      {
        key: 'render',
        value: function render() {
          var coordinates = this.state.coordinates;

          var markers = void 0;

          if (coordinates.length) {
            markers = coordinates.map(function(coord) {
              return _react2.default.createElement(
                _reactGmaps.Marker,
                (0, _extends3.default)(
                  {
                    className: 'marker',
                    lat: coord.latitude,
                    lng: coord.longitude,
                    key: coord.id
                  },
                  coord
                )
              );
            });
          } else {
            markers = _react2.default.createElement(
              _bpanelUi.Text,
              { className: 'empty' },
              'Loading peers...'
            );
          }

          return _react2.default.createElement(
            _reactGmaps.Gmaps,
            {
              lat: this.center.lat,
              lng: this.center.lng,
              width: '900px',
              height: '500px',
              zoom: 2,
              loadingMessage: 'Be happy',
              params: params
            },
            markers
          );
        }
      }
    ],
    [
      {
        key: 'defaultProps',
        get: function get() {
          return {
            peers: []
          };
        }
      },
      {
        key: 'propTypes',
        get: function get() {
          return {
            peers: _propTypes2.default.arrayOf(_propTypes2.default.object),
            theme: _propTypes2.default.object,
            coordinates: _propTypes2.default.arrayOf(_propTypes2.default.object)
          };
        }
      }
    ]
  );
  return GoogleMap;
})(_react2.default.Component);

exports.default = GoogleMap;
