'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _balancedMatch = require('balanced-match');

var _balancedMatch2 = _interopRequireDefault(_balancedMatch);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _postcssMessageHelpers = require('postcss-message-helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shades = function shades(color, weight) {
  var white = arguments.length <= 2 || arguments[2] === undefined ? '#ffffff' : arguments[2];
  var black = arguments.length <= 3 || arguments[3] === undefined ? '#000000' : arguments[3];
  var hex = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

  var rgbC = (0, _color2.default)(color).rgbArray();
  var refC = rgbC;
  var r = rgbC[0];
  var g = rgbC[1];
  var b = rgbC[2];
  var percent = 0;

  if (weight > 500) {
    refC = (0, _color2.default)(black).rgbArray();
    percent = (weight - 500) / 500;
  } else if (weight < 500) {
    refC = (0, _color2.default)(white).rgbArray();
    percent = (500 - weight) / 500;
  }

  r = Math.round(refC[0] * percent + r * (1 - percent));
  g = Math.round(refC[1] * percent + g * (1 - percent));
  b = Math.round(refC[2] * percent + b * (1 - percent));

  var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';

  return hex === true ? (0, _color2.default)('rgb(' + r + ', ' + g + ', ' + b + ')').hexString() : rgb;
};

var transformColor = function transformColor(string, source) {
  if (string.indexOf('shades(') === -1) {
    return string;
  }

  var value = (0, _balancedMatch2.default)('(', ')', string).body;

  if (!value) {
    throw new Error('Missing closing parentheses in "' + string + '"', source);
  }

  return shades.apply(null, value.split(/,\s*(?![^()]*\))/));
};

var transformDecl = function transformDecl(decl) {
  if (!decl.value || decl.value.indexOf('shades(') === -1) {
    return;
  }
  decl.value = (0, _postcssMessageHelpers.try)(function () {
    return transformColor(decl.value, decl.source);
  }, decl.source);
};

exports.default = _postcss2.default.plugin('postcss-shades', function () {
  return function (style) {
    style.walkDecls(transformDecl);
  };
});


module.exports = exports["default"];

