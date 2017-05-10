const {ipcRenderer} = require('electron');
const angular = require('angular');
require('angular-ui-router');

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
        }).state('app.conversations', {
            url: '/conversations',
            controller: 'ConversationsController',
            templateUrl: 'templates/conversations.jade'
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

module.exports = skyfeed;
