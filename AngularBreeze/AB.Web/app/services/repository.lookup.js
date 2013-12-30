(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repository.lookup';

    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryLookup]);

    function RepositoryLookup(model, abstractRepository) {
        var entityName = 'lookups';
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            //Exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
        }

        //Allow this repo to have access to the Abstract Repository
        //then put its own Ctor back on itself
        //Ctor.prototype = new AbstractRepository(Ctor);
        //Ctor.prototype.constructor = Ctor
        
        abstractRepository.extend(Ctor); //decorate Ctor method with methods from abstract repository service

        return Ctor;
        
        //#region Internal Methods        
        function getAll() { //getLookups()
            var self = this;
            return EntityQuery.from('Lookups')
                .using(self.manager).execute()
                .to$q(querySecceeded, self._queryFailed);

            function querySecceeded(data) {
                model.createNullos(self.manager);
                //Breeze caches the data locally in memory
                self.log('Retrieved [Lookups]', data, true);
                return true;
            }
        }
        
        function setLookups() {
            this.lookupCachedData = {
                rooms: this._getAllLocal(entityNames.room, 'name'),
                tracks: this._getAllLocal(entityNames.track, 'name'),
                timeslots: this._getAllLocal(entityNames.timeSlot, 'start')
            };
        }
        //#endregion
    }
})();