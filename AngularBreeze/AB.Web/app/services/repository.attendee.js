(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repository.attendee';

    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryAttendee]);

    function RepositoryAttendee(model, abstractRepository) {
        var entityName = model.entityNames.attendee;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
           
            this.getAll = getAll;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
        }

        abstractRepository.extend(Ctor);

        return Ctor;

        //#region Internal Methods       
        // formerly known as datacontext.getAttendees()
        function getAll(forceRemote, page, size, nameFilter) {
            var self = this;
            // Only return a page worth of attendees
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if (self._areItemsLoaded && !forceRemote) {
                // get local data
                return self.$q.when(getByPage());
                //attendees = _getAllLocal(entityNames.attendee, orderBy);
                //return $q.when(attendees);
            }

            return EntityQuery.from("Persons")
                .select('id, firstName, lastName, imageSource')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySecceeded, self._queryFailed);

            function querySecceeded(data) {
                var attendees = self._setIsPartialTrue(data.results);
                //attendees = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [Attendees] from remote data source',
                    attendees.length, true);
                //return attendees;
                return getByPage();
            }
            
            //region local sub functions
            function getByPage() {
                var predicate = null;
                if (nameFilter) {
                    predicate = _fullNamePredicate(nameFilter);
                }
                var attendees = EntityQuery.from(entityName)
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take)
                    .skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return attendees;
            }
        }
        
        function getCount() {
            var self = this;
            if (self._areItemsLoaded()) {
                return self.$q.when(self._getLocalEntityCount(entityName));
            }
            // Attendees aren't loaded; ask the server for a count.
            return EntityQuery.from('Persons')
                .take(0).inlineCount()
                .using(self.manager).execute()
                .to$q(self._getInlineCount);
        }
        
        function getFilteredCount(nameFilter) {
            var predicate = _fullNamePredicate(nameFilter);

            var attendees = EntityQuery.from(entityName)
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();

            return attendees.length;
        }
        
        function _fullNamePredicate(filterValue) {
            return Predicate
                .create('firstName', 'contains', filterValue)
                .or('lastName', 'contains', filterValue);
        }
        //#endregion
    }
})();