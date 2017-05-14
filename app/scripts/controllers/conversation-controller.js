const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationController', function ($scope, $stateParams) {
    $scope.conversation = $stateParams.conversation;
    $scope.messageBody = "";
    $scope.messages = [];
    var fetch = false;

    $scope.load = function(){
      if (fetch) return;
      fetch = true;

      $scope.conversation.getMessages((messages) => {
        $scope.messages.push.apply($scope.messages, messages)
        $scope.$apply();
        fetch = false;
      });
    }

    $scope.sendMessage = function(messageBody){
        $scope.conversation.sendMessage(messageBody, (error, message) => {
            $scope.messages.unshift(message);
            $scope.$apply();
        });

        $scope.messageBody = "";
	  };

    $scope.load();
});
