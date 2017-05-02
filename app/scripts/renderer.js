const {app, remote, ipcRenderer} = require('electron');
const angular = require('angular');
const loginService = require('./login-service-renderer');
const uiRouter = require('angular-ui-router');

let skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        let skipIfLoggedIn = [
            '$q', function($q) {
                let deferred = $q.defer();
                if (false) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }
        ];
        let loginRequired = [
            '$q', '$location', function($q, $location) {
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
            controller: 'ApplicationController',
            templateUrl: 'templates/layout.jade'
        }).state('app.feed', {
            url: '/feed',
            controller: 'FeedController',
            templateUrl: 'templates/feed.jade'
        }).state('app.login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'templates/login.jade'
        });
        $urlRouterProvider.otherwise('/feed');
    }
]);

skyfeed.run(['$state', function ($state) {
    ipcRenderer.on('login-success', function () {
        $state.go('app.feed');
    });
}]);

skyfeed.controller('ApplicationController', function ($scope) {
    ipcRenderer.on('login-success', function () {
        $scope.logins = loginService.getLogins();
    });
});

skyfeed.controller('FeedController', function ($scope, $state, $stateParams) {
    $scope.items = [];

    $scope.load = function () {
        let logins = loginService.getLogins();
        if (!logins.length) { return $state.go('app.login'); }

        logins.forEach(function (login) {
            login.client.getPosts(0, posts => {
                $scope.items = posts;
                $scope.$apply();
                console.log('Get Posts Result:\n', posts);
            });
        });
    };

    $scope.load();
});

skyfeed.controller('LoginCtrl', function ($scope, $http) {
    $scope.loginVk = function () {
        ipcRenderer.send('vk-button-clicked', 'ping');
    };
});
