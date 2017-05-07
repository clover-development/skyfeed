const {ipcRenderer} = require('electron');
const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ApplicationController', function ($scope) {
    $scope.updateLogins = function () {
        $scope.logins = loginService.getLogins();
    };

    ipcRenderer.on('login-success', function () { $scope.updateLogins(); });

    $scope.updateLogins();
});