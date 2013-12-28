(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'routemediator';

    angular.module('app').factory(serviceId,
        ['$rootScope', 'config', 'logger', '$location', routemediator]);

    function routemediator($rootScope, config, logger, $location) {
        // Define the functions and properties to reveal.
        var handleRouteChangeError = false;
        var service = {
            setRoutingHandlers: setRoutingHandlers
        };

        return service;

        function setRoutingHandlers() {
            updateDocTitle();
            handleRoutingErrors();
        }

        function handleRoutingErrors() {
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                    if (handleRouteChangeError) {
                        return;
                    }
                    handleRouteChangeError = true;
                    var msg = "Error routing: " + (current && current.name) +
                        '. ' + (rejection.msg || "");
                    logger.logWarning(msg, current, serviceId, true);
                    $location.path('/');
                });
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function (event, current, previous) {
                    handleRouteChangeError = false;
                    var title = config.docTitle + ' ' + (current.title || "");
                    $rootScope.title = title;
                });
        }
        
        //#region Internal Methods        

        //#endregion
    }
})();