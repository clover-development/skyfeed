const {ipcRenderer} = require('electron');
const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ApplicationController', function ($scope, $state) {
    $scope.updateLogins = function () {
        $scope.logins = loginService.getLogins();
        $scope.$apply();
        $state.reload();
    };

    $scope.logout = function (login) {
        ipcRenderer.send('logout', login.id);
    };

    ipcRenderer.on('login-success', function () { $scope.updateLogins(); });
    ipcRenderer.on('logout-success', function () { $scope.updateLogins(); });

    $scope.logins = loginService.getLogins();
});
