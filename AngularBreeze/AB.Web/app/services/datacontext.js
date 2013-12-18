(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'entityManagerFactory', 'config', datacontext]);

    function datacontext(common, emFactory, config) {
        var EntityQuery = breeze.EntityQuery;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var manager = emFactory.newManager();
        var primePromise;
        var $q = common.$q;
        
        var entityNames = {
            attendee: 'Person',
            person: 'Person',
            speaker: 'Person',
            session: 'Session',
            room: 'Room',
            track: 'Track',
            timeSlot: 'TimeSlot'
        };

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getSessionPartials: getSessionPartials,
            getSpeakerPartials: getSpeakerPartials,
            prime: prime
        };

        return service;

        function getMessageCount() { return $q.when(72); }

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

        function getSpeakerPartials() {
            var speakerOrderBy = 'firstName, lastName';
            var speakers = [];

            return EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(speakerOrderBy)
                .toType('Person')
                .using(manager).execute()
                .to$q(querySecceeded, _queryFailed);
            
            function querySecceeded(data) {
                speakers = data.results;
                log('Retrieved [Speaker Partials] from remote data source', speakers.length, true);
                return speakers;
            }
        }

        function getSessionPartials() {
            var orderBy = 'timeSlotId, level, speaker.firstName';
            var sessions;

            return EntityQuery.from('Sessions') //name 'Sessions' match the name in the WebApi Controllers
                .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
                .orderBy(orderBy)
                .toType('Session')
                .using(manager).execute()
                .to$q(querySecceeded, _queryFailed);
            //toType tells breeze what entity type to use for the projection

            function querySecceeded(data) {
                sessions = data.results;
                log('Retrieved [Session Partials] from remote data source', sessions.length, true);
                return sessions;
            }
        }

        function prime() {
            if (primePromise) return primePromise;
            
            primePromise = $q.all([getLookups(), getSpeakerPartials()])
                .then(extendMetadata)
                .then(success);//we will cache Lookups[Rooms, Tracks and TimeSlots] because we use them a lot in the app
            return primePromise;

            function success() {
                setLookups();
                log('Primed the data');
            }

            function extendMetadata() {
                var metadataStore = manager.metadataStore;

                var types = metadataStore.getEntityTypes();
                types.forEach(function(type) {
                    if(type instanceof breeze.EntityType) {
                        set(type.shortName, type);
                    }
                });

                var personEntityName = entityNames.person;
                ['Speakers', 'Speaker', 'Attendees', 'Attendee'].forEach(function(r) {
                    set(r, personEntityName);
                });
                

                function set(resourceName, entityName) {
                    metadataStore.setEntityTypeForResourceName(resourceName, entityName);
                }
            }
        }

        function setLookups() {
            //service object is the one that has been returned from current datacontext service
            service.lookupCachedData = {
                rooms: _getAllLocal(entityNames.room, 'name'),
                tracks: _getAllLocal(entityNames.track, 'name'),
                timeslots: _getAllLocal(entityNames.timeSlot, 'start')
            };
        }

        function _getAllLocal(resource, ordering) {
            return EntityQuery.from(resource)
                .orderBy(ordering)
                .using(manager)
                .executeLocally();
        }
        
        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .to$q(querySecceeded, _queryFailed);
            
            function querySecceeded(data) {
                //Breeze caches the data locally in memory
                log('Retrieved [Lookups]', data, true);
                return true;
            }
        }
        
        function _queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
            logError(msg, error);
            throw error;
        }
    }
})();