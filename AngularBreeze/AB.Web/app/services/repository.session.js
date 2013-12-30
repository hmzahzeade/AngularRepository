(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repository.session';

    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', SessionRepository]);

    function SessionRepository(model, abstractRepository) {
        var entityName = model.entityNames.session;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'timeSlotId, level, speaker.firstName';

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getById = getById;
            this.getCount = getCount;
            this.getPartials = getPartials;
            this.getTrackCounts = getTrackCounts;
        }

        abstractRepository.extend(Ctor);

        return Ctor;

        //#region Internal Methods     
        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getCount() {
            var self = this;
            if (self._areItemsLoaded()) {
                return self.$q.when(self._getLocalEntityCount(entityName));
            }

            return EntityQuery.from('Sessions')
                .take(0).inlineCount()  //take(0) - return total number
                .using(self.manager).execute()
                .to$q(self._getInlineCount);
        }
        
        function getTrackCounts() {
            return this.getPartials().then(function (data) {
                var sessions = data;
                //loop through the sessions and create a mapped track counter object
                var trackMap = sessions.reduce(function (accum, session) {
                    var trackName = session.track.name;
                    var trackId = session.track.id;
                    if (accum[trackId - 1]) {
                        accum[trackId - 1].count++;
                    } else {
                        accum[trackId - 1] = {
                            track: trackName,
                            count: 1
                        };
                    }
                    return accum;
                }, []);
                return trackMap;
            });
        }
        
        function getPartials(forceRemote) {
            var self = this;
            var sessions;

            if (self._areItemsLoaded() && !forceRemote) {
                // get local data
                sessions = self._getAllLocal(entityName, orderBy);
                return self.$q.when(sessions);
            }

            return EntityQuery.from('Sessions') //name 'Sessions' match the name in the WebApi Controllers
                .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySecceeded, self._queryFailed);
            //toType tells breeze what entity type to use for the projection

            function querySecceeded(data) {
                sessions = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [Session Partials] from remote data source', sessions.length, true);
                return sessions;
            }
        }
        //#endregion
    }
})();