var dialog = require('electron').dialog;

var OauthGithub = require('../lib/OauthGithub');

var github = new OauthGithub({
  id: '****',
  secret: '****',
  scopes: ['user:email', 'notifications'],
});

github.startRequest(function(access_token, err) {
  if (err) {
    console.error(err);
  }

  dialog.showErrorBox('Satus', 'access_token: ' + access_token);
});
