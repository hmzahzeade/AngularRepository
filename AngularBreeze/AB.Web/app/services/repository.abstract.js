(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'repository.abstract';

    angular.module('app').factory(serviceId,
        ['common', 'config', AbstractRepository]);

    function AbstractRepository(common, config) {
        var EntityQuery = breeze.EntityQuery;
        var logError = common.logger.getLogFn(this.serviceId, 'error');

        //Abstract repo gets its derived object's this.manager
        function Ctor() {
            this.isLoaded = false;
        }

        Ctor.extend = function (repoCtor) {
            //Alow thos repo to have access to the Abstract's repo functions,
            // then put its own Ctor back on itself
            repoCtor.prototype = new Ctor();
            repoCtor.prototype.constructor = repoCtor;
        };

        //Shared by repository class
        Ctor.prototype._areItemsLoaded = _areItemsLoaded;
        Ctor.prototype._getAllLocal = _getAllLocal;
        Ctor.prototype._getById = _getById;
        Ctor.prototype._getInlineCount = _getInlineCount;
        Ctor.prototype._getLocalEntityCount = _getLocalEntityCount;
        Ctor.prototype._queryFailed = _queryFailed;
        Ctor.prototype._setIsPartialTrue = _setIsPartialTrue;
        //Convenience functions for the Repos
        Ctor.prototype.log = common.logger.getLogFn(this.serviceId);
        Ctor.prototype.$q = common.$q;

        return Ctor;

        //#region Internal Methods        

        function _areItemsLoaded(value) {
            if (value === undefined) {
                return this.isLoaded; // get
            }
            return this.isLoaded = value; // set
        }
        
        function _getAllLocal(resource, ordering, predicate) {
            return EntityQuery.from(resource)
                .orderBy(ordering)
                .where(predicate)
                .using(this.manager)
                .executeLocally();
        }

        function _getById(entityName, id, forceRemote) {
            var self = this;
            var manager = self.manager;
            if (!forceRemote) {
                // check cache first
                var entity = manager.getEntityByKey(entityName, id);
                // isPartial property created in model.js
                if (entity && !entity.isPartial) {
                    self.log('Retrieved [' + entityName + '] id:' + entity.id + ' from cache.', entity, true);
                    if (entity.entityAspect.entityState.isDeleted()) {
                        entity = null; //hide entity marked-for-delete
                    }
                    return self.$q.when(entity);
                }
            }

            // Hit the server
            // It was not found in cache, so let's query it.
            return manager.fetchEntityByKey(entityName, id)
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.entity;
                if(!entity) {
                    self.log('Could not find [' + entityName + '] id:' + id, null, true);
                    return null;
                }
                entity.isPartial = false;
                self.log('Retrieved [' + entityName + '] id:' + entity.id +
                    ' from remote data source', entity, true);
                return entity;
            }
        }
        
        function _getLocalEntityCount(resource) {
            var entities = EntityQuery.from(resource)
                .using(this.manager)
                .executeLocally();
            return entities.length;
        }
        
        function _getInlineCount(data) {
            //inlineCount - breeze property - gets the number of items returned
            return data.inlineCount;
        }
        
        function _queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
            logError(msg, error);
            throw error;
        }

        function _setIsPartialTrue(entities) {
            for (var i = entities.length; i--;) {
                entities[i].isPartial = true;
            }
            return entities;
        }
        //#endregion
    }
})();