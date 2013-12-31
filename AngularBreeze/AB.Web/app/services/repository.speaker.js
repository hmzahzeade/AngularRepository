(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repository.speaker';

    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', SpeakerRepository]);

    function SpeakerRepository(model, abstractRepository) {
        var entityName = model.entityNames.speaker;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.calcIsSpeaker = calcIsSpeaker;
            this.create = create;
            this.getAllLocal = getAllLocal;
            this.getById = getById;
            this.getTopLocal = getTopLocal;
            this.getPartials = getPartials;
        }

        abstractRepository.extend(Ctor);

        return Ctor;

        //#region Internal Methods   

        function calcIsSpeaker() {
            var self = this;
            var persons = self.manager.getEntities(model.entityNames.person);
            var sessions = self.manager.getEntities(model.entityNames.session);

            persons.forEach(function(person) { person.isSpeaker = false; });

            sessions.forEach(function(session) {
                session.speaker.isSpeaker = (session.speakerId !== 0);
            });
        }

        function create() {
            return this.manager.createEntity(entityName);
        }

        function getAllLocal(includeNullo) {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            if(includeNullo) {
                predicate = predicate.or(this._predicates.isNullo);
            }
            return self._getAllLocal(entityName, orderBy, predicate);
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getPartials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            var speakerOrderBy = 'firstName, lastName';
            var speakers = [];

            if (!forceRemote) {
                // get local data
                speakers = self._getAllLocal(entityName, speakerOrderBy, predicate);
                return self.$q.when(speakers);
            }

            return EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(speakerOrderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySecceeded, self._queryFailed);

            function querySecceeded(data) {
                speakers = data.results;
                for (var i = speakers.length; i--;) {
                    speakers[i].isSpeaker = true;
                    speakers[i].isPartial = true;
                }
                self.log('Retrieved [Speaker Partials] from remote data source', speakers.length, true);
                return speakers;
            }
        }
        
        function getTopLocal() {
            var predicate = Predicate.create('lastName', '==', 'Papa')
                .or('lastName', '==', 'Guthrie')
                .or('lastName', '==', 'Bell')
                .or('lastName', '==', 'Hanselman')
                .or('lastName', '==', 'Lerman')
                .and('isSpeaker', '==', true);
            return this._getAllLocal(entityName, orderBy, predicate);
        }
        
        //#endregion
    }
})();