// const {BrowserWindow} = require('electron');
// let win = new BrowserWindow({width: 800, height: 600});
// win.on('closed', () => {
//   win = null
// });

angular.module('skyFeed', [])
  .controller("LoginCtrl", function ($scope, $http) {
    $scope.loginFb = function () {
      $http({
        method: 'GET',
        url: 'https://www.facebook.com/v2.8/dialog/oauth',
        params: {
          client_id: 1722090841416106,
          redirect_uri: 'https://www.facebook.com/connect/login_success.html',
          scope: ['user_actions.news', ''],
          display: 'popup',
          response_type: 'token'
        }
      }).then(function (res) {
      }, function () {
        alert('error');
      })
    };

    $scope.loginVk = function () {
      $http({
        method: 'GET',
        url: 'https://oauth.vk.com/authorize',
        params: {
          client_id: '5959809',
          redirect_uri: 'https://oauth.vk.com/blank.html',
          display: 'page',
          scope: 'wall, messages, notifications, notify',
          response_type: 'token'
        }
      }).then(function (res) {
        // win.loadURL(`res.data`);
      }, function (res) {
        alert('error, ' + res);
      });
    }
  });
