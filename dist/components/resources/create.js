'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _core = require('../../utils/core');

var _utils = require('../../utils');

var _options = require('../../utils/options');

var _error = require('../../utils/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (buildRoute) {

  var alterRequest = function alterRequest(req, trx, options) {

    req.data = _lodash2.default.assign(req.body, req.defaults, req.query);

    return req;
  };

  var beforeProcessor = function beforeProcessor(req, trx, options) {

    var allowed = [].concat((0, _toConsumableArray3.default)((0, _core.coerceArray)(options.allowedParams)), (0, _toConsumableArray3.default)((0, _core.coerceArray)(options.virtualParams)));

    (0, _options.checkPermitted)(req.data, allowed, 'Unable to create record with the values {unpermitted}. Please add it to allowedParams');
  };

  var processor = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, trx, options) {
      var data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              data = (0, _extends3.default)({}, (0, _utils.defaultParams)(req, trx, options), _lodash2.default.pick(req.data, options.allowedParams));
              _context.next = 4;
              return options.model.forge(data).save(null, { transacting: trx });

            case 4:
              req.resource = _context.sent;
              return _context.abrupt('return', req.resource);

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](0);

              if (!_context.t0.errors) {
                _context.next = 12;
                break;
              }

              throw new _error2.default({ code: 422, message: 'Unable to create record', errors: _context.t0.toJSON() });

            case 12:
              throw _context.t0;

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 8]]);
    }));

    return function processor(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  return buildRoute({
    action: 'create',
    method: 'post',
    path: '',
    alterRequest: alterRequest,
    beforeProcessor: beforeProcessor,
    processor: processor,
    renderer: _utils.defaultRenderer,
    responder: (0, _utils.defaultResponder)('Successfully created record')
  });
};