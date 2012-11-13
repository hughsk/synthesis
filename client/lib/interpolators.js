var TWO_PI = Math.PI * 2

var interpolate = module.exports = function (a, b) {
  b -= a

  return function interpolate(t) {
    return a + b * t
  };
};

module.exports.round = function (a, b) {
  b -= a

  return function round(t) {
    return Math.round(a + b * t)
  };
};

module.exports.quad = function (a, b) {
  b -= a

  return function quad(t) {
    return a + b * t * t
  };
};

module.exports.cubic = function (a, b) {
  b -= a

  return function cubic(t) {
    return a + b * t * t * t
  };
};

module.exports.sin = function (b, a) {
  b -= a
  b *= 0.5

  return function sin(t) {
    return a + b * (Math.cos(t * TWO_PI) + 1)
  };
};