const skyfeed = require('../angular-skyfeed');

// All rights belong to: https://github.com/ifwe/infinite-scroll
skyfeed.directive('infiniteScroll', ['$window', '$timeout', function ($window, $timeout) {
    return {
        scope: {
            callback: '&infiniteScroll',
            distance: '=infiniteScrollDistance',
            disabled: '=infiniteScrollDisabled'
        },
        link: function (scope, elem, attrs) {
            let win = angular.element($window);

            let onScroll = function (oldValue, newValue) {
                // Do nothing if infinite scroll has been disabled
                if (scope.disabled) {
                    return;
                }
                let windowHeight = win[0].innerHeight;
                let elementBottom = elem[0].offsetTop + elem[0].offsetHeight;
                let windowBottom = windowHeight + (win[0].scrollY || win[0].pageYOffset);
                let remaining = elementBottom - windowBottom;
                let shouldGetMore = (remaining - parseInt(scope.distance || 0, 10) <= 0);

                if (shouldGetMore) {
                    $timeout(scope.callback);
                }
            };

            // Check immediately if we need more items upon reenabling.
            scope.$watch('disabled', function (isDisabled) {
                if (false === isDisabled) onScroll();
            });

            win.bind('scroll', onScroll);

            // Remove window scroll handler when this element is removed.
            scope.$on('$destroy', function () {
                win.unbind('scroll', onScroll);
            });

            // Check on next event loop to give the browser a moment to paint.
            // Otherwise, the calculations may be off.
            $timeout(onScroll);
        }
    };
}]);
