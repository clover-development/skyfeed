const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationsController', function ($scope) {
  $scope.items = [];
  $scope.fetch = false;

  $scope.load = function () {
      if ($scope.fetch) return;
      $scope.fetch = true;

      let logins = loginService.getLogins();
      if (!logins.length) { return $state.go('app.login'); }

      logins.forEach(function (login) {
          console.log('yo forom dialogs load + ', login);

          login.getDialogs(dialogs => {
              $scope.items.push.apply($scope.items, dialogs);
              $scope.fetch = false;
              $scope.$apply();
          });
      });
  };

  $scope.load();
});
