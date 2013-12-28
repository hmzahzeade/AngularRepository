(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repositories';

    angular.module('app').factory(serviceId,
        ['$injector', repositories]);

    function repositories($injector) {
        var manager;
        // Define the functions and properties to reveal.
        var service = {
            getRepo: getRepo,
            init: init
        };

        return service;

        // called exclusively by datacontext
        function init(mgr) {
            manager = mgr;
        }

        function getRepo(repoName) {
            var fullRepoName = 'repository.' + repoName.toLowerCase();
            //another form of dependency injection on the fly
            var Repo = $injector.get(fullRepoName);
            return new Repo(manager);
        }
    }
})();