const electron = require('electron');
const ipc = electron.ipcRenderer;
const app = electron.app;
const remote = electron.remote;
const angular = require('angular');
const $ = require('jquery');
require('angular-ui-router');

let skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        let loginRequired, skipIfLoggedIn;
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
        }).state('app.feed', {
            url: '/feed',
            controller: 'FeedController',
            templateUrl: 'templates/start.pug'
        }).state('app.login', {
            url: '/login',
            templateUrl: 'templates/login.pug',
            controller: 'LoginCtrl'
        });
        $urlRouterProvider.otherwise('/feed');
    }
]);

skyfeed.run(['$state', function ($state) {
    ipc.on('login-success', function () {
        $state.go('app.feed');
    });
}]);

skyfeed.controller('ApplicationController', function ($scope) {

});

skyfeed.controller('FeedController', function ($scope, $stateParams) {
    $scope.load = function () {
        let login = remote.getGlobal('vkLogin');
        if (!login) return;
        let client = $scope.client = login.client;

        console.log('HUY');
        client.call('wall.post', {
                friends_only: 0,
                message: 'Post to wall via node-vkapi'
            }).then(res => {
                console.log('https://vk.com/wall' + res.user_id + '_' + res.post_id);
            });
    };

    $scope.load();
});

skyfeed.controller('LoginCtrl', function ($scope, $http) {
  $scope.loginVk = function () {
      ipc.send('vk-button-clicked', 'ping');
  };
});
