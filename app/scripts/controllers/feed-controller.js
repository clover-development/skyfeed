const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');

skyfeed.controller('FeedController', function ($scope, $state) {
    $scope.items = [];

    $scope.load = function () {
        let logins = loginService.getLogins();
        if (!logins.length) { return $state.go('app.login'); }

        logins.forEach(function (login) {
            login.getPosts(0, posts => {
                $scope.items = posts;
                $scope.$apply();
                console.log('Get Posts Result:\n', posts);
            });
        });
    };

    $scope.load();
});
