const {app, remote, ipcRenderer} = require('electron');
const angular = require('angular');
require('angular-ui-router');

let skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        let skipIfLoggedIn = [
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
        let loginRequired = [
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

});

skyfeed.controller('FeedController', function ($scope, $state, $stateParams) {
    $scope.items = [];

    $scope.load = function () {
        let login = remote.getGlobal('vkLogin');
        if (!login) {
            return $state.go('app.login');
        }
        let client = $scope.client = login.client;

        client.getPosts(0, posts => {
            $scope.items = posts;
            $scope.$apply();
            console.log('Get Posts Result: ', posts);
        });
    };

    $scope.load();
});

skyfeed.controller('LoginCtrl', function ($scope, $http) {
    $scope.loginVk = function () {
        ipcRenderer.send('vk-button-clicked', 'ping');
    };

    // $scope.loginVk();
});

skyfeed.service('$auth', function () {

});
