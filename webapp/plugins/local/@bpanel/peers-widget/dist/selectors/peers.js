'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getPeerCoordinates = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _underscore = require('underscore');

var _reselect = require('reselect');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// const getPeersFromState = ({ node: nodeState }) =>
//   nodeState.peers ? nodeState.peers : [];

var getPeers = function getPeers() {
  var peers =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return peers;
};

var getPeerCoordinates = (exports.getPeerCoordinates = (function() {
  var _ref = (0, _asyncToGenerator3.default)(
    /*#__PURE__*/ _regenerator2.default.mark(function _callee2(peers) {
      var getCoordsPromises;
      return _regenerator2.default.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                getCoordsPromises = peers.map(
                  (function() {
                    var _ref2 = (0, _asyncToGenerator3.default)(
                      /*#__PURE__*/ _regenerator2.default.mark(function _callee(
                        _ref3
                      ) {
                        var addr = _ref3.addr,
                          id = _ref3.id;
                        var ip, response, location, latitude, longitude;
                        return _regenerator2.default.wrap(
                          function _callee$(_context) {
                            while (1) {
                              switch ((_context.prev = _context.next)) {
                                case 0:
                                  ip = addr.split(':').slice(0, 1);
                                  _context.next = 3;
                                  return fetch(
                                    'http://freegeoip.net/json/' + ip
                                  );

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

                    return function(_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  })()
                );
                _context2.next = 3;
                return _promise2.default.all(getCoordsPromises);

              case 3:
                return _context2.abrupt('return', _context2.sent);

              case 4:
              case 'end':
                return _context2.stop();
            }
          }
        },
        _callee2,
        undefined
      );
    })
  );

  return function getPeerCoordinates(_x2) {
    return _ref.apply(this, arguments);
  };
})());

var pickTableData = function pickTableData(peers) {
  return peers.map(function(peer) {
    return (0, _underscore.chain)(peer)
      .pick(function(value, key) {
        var keys = ['id', 'name', 'addr', 'subver', 'inbound', 'relaytxes'];
        if (keys.indexOf(key) > -1) return true;
      })
      .mapObject(function(value) {
        // for boolean values need to convert to a string
        if (typeof value === 'boolean') return value.toString();
        return value;
      })
      .value();
  });
};

var peerCoordinates = (0, _reselect.createSelector)(
  [getPeers],
  getPeerCoordinates
);

var peerTableData = (0, _reselect.createSelector)([getPeers], pickTableData);

exports.default = {
  peerCoordinates: peerCoordinates,
  peerTableData: peerTableData
};
