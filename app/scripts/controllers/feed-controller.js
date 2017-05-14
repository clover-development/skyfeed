const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('FeedController', function ($scope, $state) {
    $scope.items = [];
    $scope.fetchCount = 0;

    $scope.load = function () {
        if ($scope.fetchCount > 0) { return }

        let logins = loginService.getLogins();
        if (!loginService.anyLogin()) { return $state.go('app.login'); }

        logins.forEach(function (login) {
            $scope.fetchCount++;
            login.getPosts(0, posts => {
                $scope.items.push.apply($scope.items, posts);

                $scope.fetchCount--;
                if ($scope.fetchCount === 0) { $scope.$apply(); }
            });
        });
    };

    $scope.switchLike = function(item) {
        item.switchLike((error, item) => {
            if (!error) { $scope.$apply(); }
        });
    };

    $scope.load();
});
