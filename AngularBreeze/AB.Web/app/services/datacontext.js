(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'config', 'entityManagerFactory', 'model', 'repositories', datacontext]);

    function datacontext(common, config, emFactory, model, repositories) {
        var EntityQuery = breeze.EntityQuery;
        var entityNames = model.entityNames;
        var events = config.events;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var manager = emFactory.newManager();
        var primePromise;
        var repoNames = ['attendee', 'lookup', 'session', 'speaker'];
        var $q = common.$q;

        var service = {
            cancel: cancel,
            markDeleted: markDeleted,
            save: save,
            prime: prime,
            //Repositories to be added on demand:
            //      attendees
            //      lookups
            //      sessions
            //      speakers
        };

        init();

        return service;

        function init() {
            repositories.init(manager);
            defineLazyLoadedRepos();
            setupEventHasChangesChanged();
        }

        function cancel() {
            if (manager.hasChanges()) {
                manager.rejectChanges();
                logSuccess('Canceled changes', null, true);
            }
        }
        
        // Add ES5 property to datacontext for each repo
        // datacontext.lookup.getAll()
        function defineLazyLoadedRepos() {
            repoNames.forEach(function(name) {
                Object.defineProperty(service, name, {
                    configurable: true, //we can redefine this property once later
                    get : function () {
                        // The 1st time repo is request via this property,
                        // we ask the repositories for it (which will inject it)
                        var repo = repositories.getRepo(name);
                        // Rewrite this property to always return this repo;
                        // no longer redefinable
                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }

        function markDeleted(entity) {
            return entity.entityAspect.setDeleted();
        }
       
        function prime() {
            if (primePromise) return primePromise;

            primePromise = $q.all([service.lookup.getAll(),
                service.speaker.getPartials(true)])
                .then(extendMetadata)
                .then(success);//we will cache Lookups[Rooms, Tracks and TimeSlots] because we use them a lot in the app
            return primePromise;

            function success() {
                service.lookup.setLookups();
                log('Primed the data');
            }

            function extendMetadata() {
                var metadataStore = manager.metadataStore;
                var types = metadataStore.getEntityTypes();
                types.forEach(function (type) {
                    if (type instanceof breeze.EntityType) {
                        set(type.shortName, type);
                    }
                });

                var personEntityName = entityNames.person;
                ['Speakers', 'Speaker', 'Attendees', 'Attendee'].forEach(function (r) {
                    set(r, personEntityName);
                });

                function set(resourceName, entityName) {
                    metadataStore.setEntityTypeForResourceName(resourceName, entityName);
                }
            }
        }
        
        function save() {
            return manager.saveChanges()
                .to$q(saveSucceeded, saveFailed);

            function saveSucceeded(result) {
                logSuccess('Saved data', result, true);
            }

            function saveFailed(error) {
                var msg = config.appErrorPrefix + 'Save failed: ' +
                    breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error);
                throw error;
                
            }
        }

        function setupEventHasChangesChanged() {
            // this event is fired every time some changes over madel has been performed
            // and we refires it using angular $broadcaset service and handles them on controllers to detect changes
            manager.hasChangesChanged.subscribe(function (eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                // send the message (the ctrl receives it)
                common.$broadcast(events.hasChangesChanged, data);
            });
        }
        
        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }
    }
})();