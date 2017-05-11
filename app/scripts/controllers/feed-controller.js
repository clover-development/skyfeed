const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('FeedController', function ($scope, $state) {
    $scope.items = [];
    $scope.fetching = false;

    $scope.load = function () {
        let logins = loginService.getLogins();
        if (!logins.length) { return $state.go('app.login'); }
        logins.forEach(function (login) {
            $scope.fetching = true;
            login.getPosts(0, posts => {
                $scope.items.push.apply($scope.items, posts);
                $scope.fetching = false;
                $scope.$apply();
            });
        });
    };

    $scope.load();
});
