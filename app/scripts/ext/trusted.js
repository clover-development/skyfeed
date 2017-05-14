const skyfeed = require('../angular-skyfeed');

skyfeed.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);
