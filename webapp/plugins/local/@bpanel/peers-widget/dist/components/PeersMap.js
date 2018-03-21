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

var _reactGmaps = require('react-gmaps');

var _peers = require('../selectors/peers');

var _markerStyles = require('./markerStyles');

var _markerStyles2 = _interopRequireDefault(_markerStyles);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var connectTheme = _bpanelUi.utils.connectTheme;

var PeersMap_ = (function(_React$PureComponent) {
  (0, _inherits3.default)(PeersMap_, _React$PureComponent);

  function PeersMap_(props) {
    (0, _classCallCheck3.default)(this, PeersMap_);

    var _this = (0, _possibleConstructorReturn3.default)(
      this,
      (PeersMap_.__proto__ || (0, _getPrototypeOf2.default)(PeersMap_)).call(
        this,
        props
      )
    );

    _this.center = {
      lat: 51.5258541,
      lng: -0.08040660000006028
    };
    _this.mapParams = {
      v: '3.exp',
      key: 'AIzaSyAt-64SBzyt3H3crm-C8xv010ns30J4J2c'
    };
    _this.state = { coordinates: [] };
    return _this;
  }

  (0, _createClass3.default)(
    PeersMap_,
    [
      {
        key: 'componentDidMount',
        value: (function() {
          var _ref = (0, _asyncToGenerator3.default)(
            /*#__PURE__*/ _regenerator2.default.mark(function _callee() {
              var peers, coordinates;
              return _regenerator2.default.wrap(
                function _callee$(_context) {
                  while (1) {
                    switch ((_context.prev = _context.next)) {
                      case 0:
                        peers = this.props.peers;

                        if (!peers.length) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 4;
                        return (0, _peers.getPeerCoordinates)(peers);

                      case 4:
                        coordinates = _context.sent;

                        this.setState({ coordinates: coordinates });

                      case 6:
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

          function componentDidMount() {
            return _ref.apply(this, arguments);
          }

          return componentDidMount;
        })()
      },
      {
        key: 'render',
        value: function render() {
          var coordinates = this.state.coordinates;
          var highlight = this.props.theme.themeVariables.themeColors
            .highlight1;

          var markers = void 0;

          var markerProps = (0, _markerStyles2.default)(highlight);
          if (coordinates.length) {
            markers = coordinates.map(function(_ref2) {
              var latitude = _ref2.latitude,
                longitude = _ref2.longitude,
                id = _ref2.id;
              return _react2.default.createElement(
                _reactGmaps.Marker,
                (0, _extends3.default)(
                  {
                    lat: latitude,
                    lng: longitude,
                    key: id,
                    label: { text: id.toString() }
                  },
                  markerProps
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
            'div',
            { className: 'col', style: { height: '500px', width: '100%' } },
            _react2.default.createElement(
              _bpanelUi.Header,
              { type: 'h3' },
              'Peer Locations'
            ),
            _react2.default.createElement(
              _bpanelUi.Text,
              { type: 'p' },
              'Below are the approximate locations of your peers based on IP address'
            ),
            _react2.default.createElement(
              _reactGmaps.Gmaps,
              {
                lat: this.center.lat,
                lng: this.center.lng,
                height: '300px',
                zoom: 2,
                loadingMessage: 'Loading peers map...',
                params: this.mapParams
              },
              markers
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
            peers: _propTypes2.default.arrayOf(_propTypes2.default.object),
            theme: _propTypes2.default.object
          };
        }
      }
    ]
  );
  return PeersMap_;
})(_react2.default.PureComponent);

var PeersMap = connectTheme(PeersMap_);

exports.default = (0, _bpanelUi.ErrorWrapper)(PeersMap);
