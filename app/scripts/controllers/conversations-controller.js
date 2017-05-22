const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');
const conversationsAggregator = require('../aggregators/conversations-aggregator');

skyfeed.controller('ConversationsController', function ($scope, $state) {
  $scope.items = [];
  $scope.fetch = false;
  conversationsAggregator.reset();

  $scope.load = function () {
      if ($scope.fetch) return;

      if (!loginService.anyLogin()) { return $state.go('app.login'); }

      $scope.fetch = true;
      conversationsAggregator.getDialogs((dialogs) => {
          $scope.items.push(...dialogs);
          $scope.fetch = false;
          $scope.$apply();
      });
  };

  $scope.load();
});
