const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationController', function ($scope, $stateParams) {
    $scope.conversation = $stateParams.conversation;
    $scope.messageBody = "";

    $scope.conversation.getMessages((messages) => {
        $scope.messages = messages;
        $scope.$apply();
    })

    $scope.sendMessage = function(messageBody){
        $scope.conversation.sendMessage(messageBody);
        $scope.messageBody = "";
	  };
});
