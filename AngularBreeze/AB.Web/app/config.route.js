(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        /*$routeProvider.when('/pass', {
            templateUrl: 'app/speaker/speakers.html',
            //Before going to this url first resolve functions will be executed
            resolve: { fake: fakeAllow }
        });
        
        $routeProvider.when('/fail', {
            templateUrl: 'app/attendee/attendees.html',
            //Resolve this first
            resolve: {
                fake: fakeReject
            }
        });

        fakeAllow.$inject = ['$q'];
        function fakeAllow($q) {
            var data = { x: 1 };
            var defer = $q.defer();
            defer.resolve(data);
            return defer.promise;
        }
        
        fakeReject.$inject = ['$q'];
        function fakeReject($q) {
            var defer = $q.defer();
            defer.reject({msg: 'You shall not pass!'});
            return defer.promise;
        }*/

        routes.forEach(function (r) {
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, definition) {
            //set resolvers for all of the routes
            //by extending any existing resolvers (or creating a new one)
            //extend resolve parameter (one that will be called before route) to prime the app data first
            definition.resolve = angular.extend(definition.resolve || { }, {
                prime: prime 
            });
            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }
    
    prime.$inject = ['datacontext'];
    function prime(dc) {
        return dc.prime();
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="icon-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/sessions',
                config: {
                    title: 'sessions',
                    templateUrl: 'app/session/sessions.html',
                    settings: {
                        nav: 2,
                        content: '<i class="icon-calendar"></i> Sessions'
                    }
                }
            }, {
                url: '/sessions/search/:search',
                config: {
                    title: 'sessions-search',
                    templateUrl: 'app/session/sessions.html',
                    settings: { /*we dont need to show this route*/ }
                }
            }, {
                url: '/speakers',
                config: {
                    title: 'speakers',
                    templateUrl: 'app/speaker/speakers.html',
                    settings: {
                        nav: 3,
                        content: '<i class="icon-user"></i> Speakers'
                    }
                }
            }, {
                url: "/speaker/:id",
                config: {
                    templateUrl: "app/speaker/speakerdetail.html",
                    title: "speaker",
                    settings: {}
                }
            }, {
                url: '/attendees',
                config: {
                    title: 'attendees',
                    templateUrl: 'app/attendee/attendees.html',
                    settings: {
                        nav: 4,
                        content: '<i class="icon-group"></i> Attendees'
                    }
                }
            }
        ];
    }
})();