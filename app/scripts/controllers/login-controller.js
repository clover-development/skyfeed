const {ipcRenderer} = require('electron');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('LoginCtrl', function ($scope) {
    $scope.loginVk = function () {
        ipcRenderer.send('vk-button-clicked', 'ping');
    };
});
