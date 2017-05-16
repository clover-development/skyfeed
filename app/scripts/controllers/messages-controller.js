const skyfeed = require('../angular-skyfeed');

skyfeed.controller('MessagesController', function ($scope, $stateParams) {
    $scope.conversation = $stateParams.conversation;
    $scope.conversation.resetPage();
    $scope.messageBody = "";
    $scope.messages = [];
    $scope.fetch = false;

    $scope.load = function() {
        if ($scope.fetch) { return }
        $scope.fetch = true;

        $scope.conversation.getMessages((messages) => {
            $scope.messages.push.apply($scope.messages, messages);
            $scope.$apply();
            $scope.fetch = false;
        });
    };

    $scope.sendMessage = function(messageBody){
        $scope.conversation.sendMessage(messageBody, (error, message) => {
            $scope.messages.unshift(message);
            $scope.$apply();
        });

        $scope.messageBody = "";
    };

    $scope.load();
});
