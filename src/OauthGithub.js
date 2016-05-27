'use strict';

import assert from 'assert';
import * as electron from 'electron';
import {BrowserWindow,app} from 'electron';
import request from 'superagent';

//const isDev = require('electron-is-dev')


export default class AuthWindow {
  constructor({ id, secret, remote = false,scopes = [], waitForApp = false }) {
    assert(id, 'Client ID is needed!');
    assert(secret, 'Client Secret is needed!');
    this.scopeQuery = scopes.length > 0 ? '&scope=' + scopes.join('%2C') : '';
    this.clientId = id;
    this.clientSecret = secret;
    this.waitForApp = waitForApp;
    this.remote = remote === true;
    this.window = null;
    this.electron = (this.remote) ? electron.remote : electron;
    this.app = this.electron.app;
    this.BrowserWindow = this.electron.BrowserWindow;

  }



  startRequest(callback) {

    const doAuth = () => {
      this.window = new this.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true, webSecurity: false
        }
      });


      var authURL = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId + this.scopeQuery;

      this.window.webContents.on('did-finish-load', () => {
        this.window.show();
        this.window.focus();
      });

      this.window.webContents.on('did-fail-load',(event,errorCode,errorDescription,validatedURL,isMainFrame) => {
        console.error('LOAD FAILED',event,errorCode,errorDescription,validatedURL,isMainFrame);
        callback({errorCode,errorDescription,validatedURL,isMainFrame})
      });

      this.window.webContents.on('will-navigate', (event, url) => {
        this.handleCallback(url, callback);
      });
      this.window.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        this.handleCallback(newUrl, callback);
      });
      this.window.on('close', () => {
        this.window = null;
      }, false);

      this.window.loadURL(authURL);
    };

    (this.waitForApp) ? this.app.on('ready', doAuth) : doAuth()
  }

  handleCallback(url, callback) {
    let raw_code = /code=([^&]*)/.exec(url) || null;
    let code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    let error = /\?error=(.+)$/.exec(url);

    if (code) {
      this.requestGithubToken(this.clientId, this.clientSecret, this.scopeQuery, code, callback);
    } else if (error) {
      console.log(error);
    }
  }

  requestGithubToken(id, secret, scopes, code, callback) {
    request.post('https://github.com/login/oauth/access_token', {
      client_id: id,
      client_secret: secret,
      code: code,
    }).end((err, response) => {
      try {
        if (err) {
          callback(err);
        } else {
          callback(null, response.body.access_token, this);
        }
      } finally {
        this.window.close()
      }
    });
  }

}
