'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _googleMapReact = require('google-map-react');

var _googleMapReact2 = _interopRequireDefault(_googleMapReact);

var _bpanelUi = require('@bpanel/bpanel-ui');

var _Marker = require('./Marker');

var _Marker2 = _interopRequireDefault(_Marker);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var getCoords = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee(_ref2) {
      var addr = _ref2.addr,
        id = _ref2.id;
      var ip, response, location, latitude, longitude;
      return _regenerator2.default.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                ip = addr.split(':').slice(0, 1);
                _context.next = 3;
                return fetch('http://freegeoip.net/json/' + ip);

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                location = _context.sent;
                (latitude = location.latitude),
                  (longitude = location.longitude);
                return _context.abrupt('return', {
                  latitude: latitude,
                  longitude: longitude,
                  id: id
                });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        undefined
      );
    })
  );

  return function getCoords(_x) {
    return _ref.apply(this, arguments);
  };
})();

var PeersMap = (function(_Component) {
  (0, _inherits3.default)(PeersMap, _Component);

  function PeersMap(props) {
    (0, _classCallCheck3.default)(this, PeersMap);

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (PeersMap.__proto__ || (0, _getPrototypeOf2.default)(PeersMap)).call(
        this,
        props
      )
    );

    _this.state = { coordinates: [] };
    return _this;
  }

  (0, _createClass3.default)(
    PeersMap,
    [
      {
        key: 'componentWillReceiveProps',
        value: (function() {
          var _ref3 = (0, _asyncToGenerator3.default)(
            /*#__PURE__*/ _regenerator2.default.mark(function _callee2(
              nextProps
            ) {
              var peers, getCoordsPromises, coordinates;
              return _regenerator2.default.wrap(
                function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        if (
                          !(
                            this.props.peers &&
                            this.props.peers[0] === nextProps.peers[0]
                          )
                        ) {
                          _context2.next = 2;
                          break;
                        }

                        return _context2.abrupt('return');

                      case 2:
                        peers = nextProps.peers;

                        if (!peers.length) {
                          _context2.next = 9;
                          break;
                        }

                        getCoordsPromises = peers.map(function(peer) {
                          return getCoords(peer);
                        });
                        _context2.next = 7;
                        return _promise2.default.all(getCoordsPromises);

                      case 7:
                        coordinates = _context2.sent;

                        this.setState({ coordinates: coordinates });

                      case 9:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                },
                _callee2,
                this
              );
            })
          );

          function componentWillReceiveProps(_x2) {
            return _ref3.apply(this, arguments);
          }

          return componentWillReceiveProps;
        })()
      },
      {
        key: 'render',
        value: function render() {
          var center = this.props.center;
          var coordinates = this.state.coordinates;

          var markers = void 0;

          if (coordinates.length) {
            markers = coordinates.map(function(coord) {
              return _react2.default.createElement(
                _Marker2.default,
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
              { lat: center[0], lng: center[1], className: 'empty' },
              'Loading...'
            );
          }
          return _react2.default.createElement(
            _googleMapReact2.default,
            {
              bootstrapURLKeys: {
                key: ['AIzaSyAt-64SBzyt3H3crm-C8xv010ns30J4J2c']
              },
              center: this.props.center,
              zoom: this.props.zoom
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
            center: [59.938043, 30.337157],
            zoom: 1,
            peers: []
          };
        }
      },
      {
        key: 'propTypes',
        get: function get() {
          return {
            center: _propTypes2.default.array,
            zoom: _propTypes2.default.number,
            peers: _propTypes2.default.arrayOf(_propTypes2.default.object),
            theme: _propTypes2.default.object
          };
        }
      }
    ]
  );
  return PeersMap;
})(_react.Component);

exports.default = PeersMap;
