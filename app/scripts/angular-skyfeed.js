const {ipcRenderer} = require('electron');
const angular = require('angular');
require('angular-ui-router');

let skyfeed = angular.module('skyfeed', [
    'ui.router'
]);

skyfeed.config([
    '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
        }).state('app.messages', {
            url: '/messages',
            controller: 'MessagesController',
            templateUrl: 'templates/messages.jade',
            params: { conversation: null }
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
