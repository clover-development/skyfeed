const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationController', function ($scope, $stateParams) {
    $scope.client = $stateParams.client;

    $scope.client.getMessages($stateParams.userID, (messages) => {
        $scope.messages = messages;
        $scope.$apply();
    })
});
