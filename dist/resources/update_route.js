'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _error = require('../error');

var _error2 = _interopRequireDefault(_error);

var _route = require('../route');

var _route2 = _interopRequireDefault(_route);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdateRoute = function (_Route) {
  (0, _inherits3.default)(UpdateRoute, _Route);

  function UpdateRoute() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, UpdateRoute);

    var _this = (0, _possibleConstructorReturn3.default)(this, (UpdateRoute.__proto__ || Object.getPrototypeOf(UpdateRoute)).call(this, config));

    _this.setAction('update');
    _this.setMethod('patch');
    _this.setPath('/:id');
    _this.setProcessor(_this._processor);
    if (config.allowedParams) _this.setAllowedParams(config.allowedParams);
    if (config.model) _this.setModel(config.model);
    if (config.virtualParams) _this.setVirtualParams(config.virtualParams);
    return _this;
  }

  (0, _createClass3.default)(UpdateRoute, [{
    key: 'setAllowedParams',
    value: function setAllowedParams(allowedParams) {
      this._setRouteParams('allowedParams', allowedParams);
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {
      this._setRouteParams('model', model);
    }
  }, {
    key: 'setVirtualParams',
    value: function setVirtualParams(virtualParams) {
      this._setRouteParams('virtualParams', virtualParams);
    }
  }, {
    key: '_processor',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, trx, options) {
        var params;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                params = this._allowedParams(req.body, options.allowedParams, options.virtualParams);


                req.resource.save(params, {
                  patch: true,
                  transacting: trx
                });

                return _context.abrupt('return', req.resource);

              case 6:
                _context.prev = 6;
                _context.t0 = _context['catch'](0);
                throw new _error2.default({
                  code: 422,
                  message: 'Unable to update record',
                  errors: _context.t0.errors ? _context.t0.toJSON() : _context.t0.message
                });

              case 9:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 6]]);
      }));

      function _processor(_x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return _processor;
    }()
  }, {
    key: '_allowedParams',
    value: function _allowedParams(body, allowedParams, virtualParams) {

      var allowed = [].concat((0, _toConsumableArray3.default)(_lodash2.default.castArray(allowedParams)), (0, _toConsumableArray3.default)(_lodash2.default.castArray(virtualParams)));

      return _lodash2.default.pick(body, allowed);
    }
  }]);
  return UpdateRoute;
}(_route2.default);

exports.default = UpdateRoute;