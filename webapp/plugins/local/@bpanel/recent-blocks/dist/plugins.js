'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _chainSockets = require('@bpanel/chain-sockets');

var bpanelChainSockets = _interopRequireWildcard(_chainSockets);

var _dashboard = require('../../dashboard');

var bpanelDashboard = _interopRequireWildcard(_dashboard);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj.default = obj;
    return newObj;
  }
}

exports.default = {
  bpanelChainSockets: bpanelChainSockets,
  bpanelDashboard: bpanelDashboard
};
// TODO: import published dashboard plugin @bpanel/dashboard
