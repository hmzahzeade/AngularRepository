(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'model';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, model);

    function model() {
        var nulloDate = new Date(1990, 0, 1);

        // Define the functions and properties to reveal.
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
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames
        };

        return service;

        function configureMetadataStore(metadataStore) {
            //TODO register session - tags
            //TODO register person - fullname
            //TODO register timeslot - name
            registerTimeSlot(metadataStore);
            registerSession(metadataStore);
            registerPerson(metadataStore);
        }

        //#region Internal Methods      

        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;
            
            createNullo(entityNames.timeSlot, {start: nulloDate, isSessionSlot: true});
            createNullo(entityNames.room);
            createNullo(entityNames.track);
            createNullo(entityNames.speaker, {firstName: ' [Select a person]'});

            function createNullo(entityName, values) {
                var initialValues = values ||
                    { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        function registerTimeSlot(metadataStore) {
            metadataStore.registerEntityTypeCtor('TimeSlot', TimeSlot);

            function TimeSlot() {}

            Object.defineProperty(TimeSlot.prototype, 'name', {
                get : function () {
                    //formatted dates are good!
                    var start = this.start;
                    //moment.js is date library
                    var value = ((start - nulloDate) === 0) ?
                        ' [Select a timeslot]' :
                        (start && moment.utc(start).isValid()) ?
                            moment.utc(start).format('ddd hh:mm a') :
                            ' [Unknown]';
                    return value;
                }
            });
        }
        
        function registerSession(metadataStore) {
            metadataStore.registerEntityTypeCtor('Session', Session);

            function Session() {
                this.isPartial = false;
            }

            Object.defineProperty(Session.prototype, 'tagsFormatted', {
                get: function () {
                    return this.tags ? this.tags.replace(/\|/g, ', ') : this.tags;
                },
                set : function(value) {
                    this.tags = value.replace(/\,/g, '|');
                }
            });
        }
        
        function registerPerson(metadataStore) {
            metadataStore.registerEntityTypeCtor('Person', Person);

            function Person() {
                //extend client model with isSpeaker property
                this.isPartial = false;
                this.isSpeaker = false;
            }

            Object.defineProperty(Person.prototype, 'fullName', {
                get: function () {
                    var fn = this.firstName;
                    var ln = this.lastName;
                    return ln ? fn + ' ' + ln : fn;
                }
            });
        }
        //#endregion
    }
})();