'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _electron = require('electron');

var electron = _interopRequireWildcard(_electron);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//const isDev = require('electron-is-dev')

var AuthWindow = function () {
  function AuthWindow(_ref) {
    var id = _ref.id;
    var secret = _ref.secret;
    var _ref$remote = _ref.remote;
    var remote = _ref$remote === undefined ? false : _ref$remote;
    var _ref$scopes = _ref.scopes;
    var scopes = _ref$scopes === undefined ? [] : _ref$scopes;
    var _ref$waitForApp = _ref.waitForApp;
    var waitForApp = _ref$waitForApp === undefined ? false : _ref$waitForApp;

    _classCallCheck(this, AuthWindow);

    (0, _assert2.default)(id, 'Client ID is needed!');
    (0, _assert2.default)(secret, 'Client Secret is needed!');
    this.scopeQuery = scopes.length > 0 ? '&scope=' + scopes.join('%2C') : '';
    this.clientId = id;
    this.clientSecret = secret;
    this.waitForApp = waitForApp;
    this.remote = remote === true;
    this.window = null;
    this.electron = this.remote ? electron.remote : electron;
    this.app = this.electron.app;
    this.BrowserWindow = this.electron.BrowserWindow;
  }

  _createClass(AuthWindow, [{
    key: 'startRequest',
    value: function startRequest(callback) {
      var _this = this;

      var doAuth = function doAuth() {
        _this.window = new _this.BrowserWindow({
          width: 800,
          height: 600,
          webPreferences: {
            nodeIntegration: true, webSecurity: false
          }
        });

        var authURL = 'https://github.com/login/oauth/authorize?client_id=' + _this.clientId + _this.scopeQuery;

        _this.window.webContents.on('did-finish-load', function () {
          _this.window.show();
          _this.window.focus();
        });

        _this.window.webContents.on('did-fail-load', function (event, errorCode, errorDescription, validatedURL, isMainFrame) {
          console.error('LOAD FAILED', event, errorCode, errorDescription, validatedURL, isMainFrame);
          callback({ errorCode: errorCode, errorDescription: errorDescription, validatedURL: validatedURL, isMainFrame: isMainFrame });
        });

        _this.window.webContents.on('will-navigate', function (event, url) {
          _this.handleCallback(url, callback);
        });
        _this.window.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
          _this.handleCallback(newUrl, callback);
        });
        _this.window.on('close', function () {
          _this.window = null;
        }, false);

        _this.window.loadURL(authURL);
      };

      this.waitForApp ? this.app.on('ready', doAuth) : doAuth();
    }
  }, {
    key: 'handleCallback',
    value: function handleCallback(url, callback) {
      var raw_code = /code=([^&]*)/.exec(url) || null;
      var code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(url);

      if (code) {
        this.requestGithubToken(this.clientId, this.clientSecret, this.scopeQuery, code, callback);
      } else if (error) {
        console.log(error);
      }
    }
  }, {
    key: 'requestGithubToken',
    value: function requestGithubToken(id, secret, scopes, code, callback) {
      var _this2 = this;

      _superagent2.default.post('https://github.com/login/oauth/access_token', {
        client_id: id,
        client_secret: secret,
        code: code
      }).end(function (err, response) {
        try {
          if (err) {
            callback(err);
          } else {
            callback(null, response.body.access_token, _this2);
          }
        } finally {
          _this2.window.close();
        }
      });
    }
  }]);

  return AuthWindow;
}();

exports.default = AuthWindow;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9PYXV0aEdpdGh1Yi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQTs7OztBQUNBOztJQUFZLFE7O0FBRVo7Ozs7Ozs7Ozs7OztJQUtxQixVO0FBQ25CLDRCQUE0RTtBQUFBLFFBQTlELEVBQThELFFBQTlELEVBQThEO0FBQUEsUUFBMUQsTUFBMEQsUUFBMUQsTUFBMEQ7QUFBQSwyQkFBbEQsTUFBa0Q7QUFBQSxRQUFsRCxNQUFrRCwrQkFBekMsS0FBeUM7QUFBQSwyQkFBbkMsTUFBbUM7QUFBQSxRQUFuQyxNQUFtQywrQkFBMUIsRUFBMEI7QUFBQSwrQkFBdEIsVUFBc0I7QUFBQSxRQUF0QixVQUFzQixtQ0FBVCxLQUFTOztBQUFBOztBQUMxRSwwQkFBTyxFQUFQLEVBQVcsc0JBQVg7QUFDQSwwQkFBTyxNQUFQLEVBQWUsMEJBQWY7QUFDQSxTQUFLLFVBQUwsR0FBa0IsT0FBTyxNQUFQLEdBQWdCLENBQWhCLEdBQW9CLFlBQVksT0FBTyxJQUFQLENBQVksS0FBWixDQUFoQyxHQUFxRCxFQUF2RTtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssWUFBTCxHQUFvQixNQUFwQjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLFNBQUssTUFBTCxHQUFjLFdBQVcsSUFBekI7QUFDQSxTQUFLLE1BQUwsR0FBYyxJQUFkO0FBQ0EsU0FBSyxRQUFMLEdBQWlCLEtBQUssTUFBTixHQUFnQixTQUFTLE1BQXpCLEdBQWtDLFFBQWxEO0FBQ0EsU0FBSyxHQUFMLEdBQVcsS0FBSyxRQUFMLENBQWMsR0FBekI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsS0FBSyxRQUFMLENBQWMsYUFBbkM7QUFFRDs7OztpQ0FJWSxRLEVBQVU7QUFBQTs7QUFFckIsVUFBTSxTQUFTLFNBQVQsTUFBUyxHQUFNO0FBQ25CLGNBQUssTUFBTCxHQUFjLElBQUksTUFBSyxhQUFULENBQXVCO0FBQ25DLGlCQUFPLEdBRDRCO0FBRW5D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dWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCAqIGFzIGVsZWN0cm9uIGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7QnJvd3NlcldpbmRvdyxhcHB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVyYWdlbnQnO1xuXG4vL2NvbnN0IGlzRGV2ID0gcmVxdWlyZSgnZWxlY3Ryb24taXMtZGV2JylcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRoV2luZG93IHtcbiAgY29uc3RydWN0b3IoeyBpZCwgc2VjcmV0LCByZW1vdGUgPSBmYWxzZSxzY29wZXMgPSBbXSwgd2FpdEZvckFwcCA9IGZhbHNlIH0pIHtcbiAgICBhc3NlcnQoaWQsICdDbGllbnQgSUQgaXMgbmVlZGVkIScpO1xuICAgIGFzc2VydChzZWNyZXQsICdDbGllbnQgU2VjcmV0IGlzIG5lZWRlZCEnKTtcbiAgICB0aGlzLnNjb3BlUXVlcnkgPSBzY29wZXMubGVuZ3RoID4gMCA/ICcmc2NvcGU9JyArIHNjb3Blcy5qb2luKCclMkMnKSA6ICcnO1xuICAgIHRoaXMuY2xpZW50SWQgPSBpZDtcbiAgICB0aGlzLmNsaWVudFNlY3JldCA9IHNlY3JldDtcbiAgICB0aGlzLndhaXRGb3JBcHAgPSB3YWl0Rm9yQXBwO1xuICAgIHRoaXMucmVtb3RlID0gcmVtb3RlID09PSB0cnVlO1xuICAgIHRoaXMud2luZG93ID0gbnVsbDtcbiAgICB0aGlzLmVsZWN0cm9uID0gKHRoaXMucmVtb3RlKSA/IGVsZWN0cm9uLnJlbW90ZSA6IGVsZWN0cm9uO1xuICAgIHRoaXMuYXBwID0gdGhpcy5lbGVjdHJvbi5hcHA7XG4gICAgdGhpcy5Ccm93c2VyV2luZG93ID0gdGhpcy5lbGVjdHJvbi5Ccm93c2VyV2luZG93O1xuXG4gIH1cblxuXG5cbiAgc3RhcnRSZXF1ZXN0KGNhbGxiYWNrKSB7XG5cbiAgICBjb25zdCBkb0F1dGggPSAoKSA9PiB7XG4gICAgICB0aGlzLndpbmRvdyA9IG5ldyB0aGlzLkJyb3dzZXJXaW5kb3coe1xuICAgICAgICB3aWR0aDogODAwLFxuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsIHdlYlNlY3VyaXR5OiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcblxuXG4gICAgICB2YXIgYXV0aFVSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYXV0aG9yaXplP2NsaWVudF9pZD0nICsgdGhpcy5jbGllbnRJZCArIHRoaXMuc2NvcGVRdWVyeTtcblxuICAgICAgdGhpcy53aW5kb3cud2ViQ29udGVudHMub24oJ2RpZC1maW5pc2gtbG9hZCcsICgpID0+IHtcbiAgICAgICAgdGhpcy53aW5kb3cuc2hvdygpO1xuICAgICAgICB0aGlzLndpbmRvdy5mb2N1cygpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2luZG93LndlYkNvbnRlbnRzLm9uKCdkaWQtZmFpbC1sb2FkJywoZXZlbnQsZXJyb3JDb2RlLGVycm9yRGVzY3JpcHRpb24sdmFsaWRhdGVkVVJMLGlzTWFpbkZyYW1lKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0xPQUQgRkFJTEVEJyxldmVudCxlcnJvckNvZGUsZXJyb3JEZXNjcmlwdGlvbix2YWxpZGF0ZWRVUkwsaXNNYWluRnJhbWUpO1xuICAgICAgICBjYWxsYmFjayh7ZXJyb3JDb2RlLGVycm9yRGVzY3JpcHRpb24sdmFsaWRhdGVkVVJMLGlzTWFpbkZyYW1lfSlcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLndpbmRvdy53ZWJDb250ZW50cy5vbignd2lsbC1uYXZpZ2F0ZScsIChldmVudCwgdXJsKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2FsbGJhY2sodXJsLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMud2luZG93LndlYkNvbnRlbnRzLm9uKCdkaWQtZ2V0LXJlZGlyZWN0LXJlcXVlc3QnLCAoZXZlbnQsIG9sZFVybCwgbmV3VXJsKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2FsbGJhY2sobmV3VXJsLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMud2luZG93Lm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgdGhpcy53aW5kb3cgPSBudWxsO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICB0aGlzLndpbmRvdy5sb2FkVVJMKGF1dGhVUkwpO1xuICAgIH07XG5cbiAgICAodGhpcy53YWl0Rm9yQXBwKSA/IHRoaXMuYXBwLm9uKCdyZWFkeScsIGRvQXV0aCkgOiBkb0F1dGgoKVxuICB9XG5cbiAgaGFuZGxlQ2FsbGJhY2sodXJsLCBjYWxsYmFjaykge1xuICAgIGxldCByYXdfY29kZSA9IC9jb2RlPShbXiZdKikvLmV4ZWModXJsKSB8fCBudWxsO1xuICAgIGxldCBjb2RlID0gKHJhd19jb2RlICYmIHJhd19jb2RlLmxlbmd0aCA+IDEpID8gcmF3X2NvZGVbMV0gOiBudWxsO1xuICAgIGxldCBlcnJvciA9IC9cXD9lcnJvcj0oLispJC8uZXhlYyh1cmwpO1xuXG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIHRoaXMucmVxdWVzdEdpdGh1YlRva2VuKHRoaXMuY2xpZW50SWQsIHRoaXMuY2xpZW50U2VjcmV0LCB0aGlzLnNjb3BlUXVlcnksIGNvZGUsIGNhbGxiYWNrKTtcbiAgICB9IGVsc2UgaWYgKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcmVxdWVzdEdpdGh1YlRva2VuKGlkLCBzZWNyZXQsIHNjb3BlcywgY29kZSwgY2FsbGJhY2spIHtcbiAgICByZXF1ZXN0LnBvc3QoJ2h0dHBzOi8vZ2l0aHViLmNvbS9sb2dpbi9vYXV0aC9hY2Nlc3NfdG9rZW4nLCB7XG4gICAgICBjbGllbnRfaWQ6IGlkLFxuICAgICAgY2xpZW50X3NlY3JldDogc2VjcmV0LFxuICAgICAgY29kZTogY29kZSxcbiAgICB9KS5lbmQoKGVyciwgcmVzcG9uc2UpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlLmJvZHkuYWNjZXNzX3Rva2VuLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy53aW5kb3cuY2xvc2UoKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==
//# sourceMappingURL=OauthGithub.js.map