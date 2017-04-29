const electron = require('electron');
const ipc = electron.ipcRenderer;
const app = electron.app;
const angular = require('angular');
const $ = require('jquery');
require('angular-ui-router');

let skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        var loginRequired, skipIfLoggedIn;
        skipIfLoggedIn = [
            '$q', '$auth', function($q, $auth) {
                let deferred = $q.defer();
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
                let deferred = $q.defer();
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
        $urlRouterProvider.otherwise('/index');
    }
]);

skyfeed.run(['$state', function ($state) {
    ipc.on('login-success', function () {
        $state.go('app.index');
    });
}]);

skyfeed.controller("ApplicationController", function ($scope) {

});

skyfeed.controller("LoginCtrl", function ($scope, $http) {
  $scope.loginFb = function () {
      ipcRenderer.send('facebook-button-clicked', 'ping');
  };
  $scope.loginVk = function () {
      ipcRenderer.send('vk-button-clicked', 'ping');
  };
});
