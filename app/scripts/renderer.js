const electron = require('electron');
const app = electron.app;
const angular = require('angular');
require('angular-ui-router');

var skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        var loginRequired, skipIfLoggedIn;
        skipIfLoggedIn = [
            '$q', '$auth', function($q, $auth) {
                var deferred;
                deferred = $q.defer();
                if (false) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }
        ];
        loginRequired = [
            '$q', '$location', '$auth', function($q, $location, $auth) {
                var deferred;
                deferred = $q.defer();
                if (true) {
                    deferred.resolve();
                } else {
                    $location.path('/login');
                }
                return deferred.promise;
            }
        ];
        $stateProvider.state('app', {
            templateUrl: 'templates/layout.pug',
            controller: 'ApplicationController'
        }).state('app.index', {
            url: '/index',
            templateUrl: 'templates/start.pug'
        }).state('app.login', {
            url: '/login',
            templateUrl: 'templates/login.pug',
            controller: 'LoginCtrl'
        });
        return $urlRouterProvider.otherwise('/index');
    }
]);

skyfeed.controller("ApplicationController", function ($scope) {

});

skyfeed.controller("LoginCtrl", function ($scope, $http) {
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
});
