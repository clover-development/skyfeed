const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('ConversationsController', function ($scope) {
  $scope.items = [];
  var fetch = false;

  $scope.load = function () {
      if (fetch) return;
      fetch = true;

      let logins = loginService.getLogins();
      if (!logins.length) { return $state.go('app.login'); }

      logins.forEach(function (login) {
          login.getDialogs(dialogs => {
              $scope.items.push.apply($scope.items, dialogs);
              $scope.$apply();
              fetch = false;
          });
      });
  };

  $scope.load();
});
