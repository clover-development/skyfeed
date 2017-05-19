const loginService = require('../login-service-renderer');
const skyfeed = require('../angular-skyfeed');
const postsAggregator = require('../aggregators/posts-aggregator');

skyfeed.controller('FeedController', function ($scope, $state) {
    $scope.items = [];
    $scope.fetching = false;
    postsAggregator.reset();

    $scope.load = function () {
        if ($scope.fetching) { return }

        if (!loginService.anyLogin()) { return $state.go('app.login'); }

        $scope.fetching = true;
        postsAggregator.getPosts((posts) => {
            $scope.items.push(...posts);
            $scope.fetching = false;
            $scope.$apply();
        });
    };

    $scope.switchLike = function(item) {
        item.switchLike((error, item) => {
            if (!error) { $scope.$apply(); }
        });
    };

    $scope.load();
});
