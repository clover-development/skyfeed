const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationsController', function ($scope) {
  $scope.items = [];
  $scope.fetchCount = 0;

  $scope.load = function () {
      if ($scope.fetchCount > 0) { return }

      let logins = loginService.getLogins();
      if (!logins.length) { return $state.go('app.login'); }

      logins.forEach(function (login) {
          $scope.fetchCount++;
          login.getDialogs(dialogs => {
              $scope.items.push.apply($scope.items, dialogs);

              $scope.fetchCount--;
              if ($scope.fetchCount === 0) { $scope.$apply(); }
          });
      })
  };

  $scope.load();
});
