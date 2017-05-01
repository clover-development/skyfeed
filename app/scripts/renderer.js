const electron = require('electron');
const ipc = electron.ipcRenderer;
const app = electron.app;
const remote = electron.remote;
const angular = require('angular');
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
            templateUrl: 'templates/layout.jade',
            controller: 'ApplicationController'
        }).state('app.feed', {
            url: '/feed',
            controller: 'FeedController',
            templateUrl: 'templates/feed.jade'
        }).state('app.login', {
            url: '/login',
            templateUrl: 'templates/login.jade',
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
    $scope.items = [];

    $scope.load = function () {
        let login = remote.getGlobal('vkLogin');
        if (!login) return;
        let client = $scope.client = login.client;

        client.call('newsfeed.get', {}).then(res => {
            $scope.items = res.items;
            $scope.$apply();
            console.log(res);
        });
    };

    $scope.load();
});

skyfeed.controller('LoginCtrl', function ($scope, $http) {
    $scope.loginVk = function () {
        ipc.send('vk-button-clicked', 'ping');
    };

    $scope.loginVk();
});

skyfeed.service('$auth', function () {

});
