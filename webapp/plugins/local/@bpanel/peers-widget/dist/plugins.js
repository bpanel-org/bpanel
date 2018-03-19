'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _dashboard = require('../../dashboard');

var BpanelDashboard = _interopRequireWildcard(_dashboard);

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

exports.default = { BpanelDashboard: BpanelDashboard };
