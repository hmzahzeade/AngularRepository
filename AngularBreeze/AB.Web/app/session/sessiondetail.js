(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$routeParams', '$window',
            'common', 'config', 'datacontext', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window,
        common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var logError = getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.rooms = [];
        vm.save = save;
        vm.session = undefined;
        vm.speakers = [];
        vm.timeslots = [];
        vm.tracks = [];

        activate();

        // vm.canSave  -  now we can call it on view as vm.canSave not vm.canSave()
        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function activate() {
            initLookups();
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSession()], controllerId);
        }

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        }

        function cancel() {
            datacontext.cancel();
            //if it is create case - check entity state - return to speakers;
            if (vm.session.entityAspect.entityState.isDetached()) {
                gotoSessions();
            }
        }
        
        function gotoSessions() { $location.path('/sessions'); }

        function getRequestedSession() {
            var val = $routeParams.id;
            
            if(val === 'new') {
                vm.session = datacontext.session.create();
                return vm.session;
            }

            return datacontext.session.getById(val)
                .then(function (data) {
                    vm.session = data;
                }, function (error) {
                    logError('Unable to get session ' + val);
                });
        }

        function goBack() {
            $window.history.back();
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.rooms = lookups.rooms;
            vm.timeslots = lookups.timeslots;
            vm.tracks = lookups.tracks;
            vm.speakers = datacontext.speaker.getAllLocal(true);
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function save() {
            if (!canSave()) { return $q.when(null); } // Must return a promise

            vm.isSaving = true;
            datacontext.save().
                then(function (saveResult) {
                    vm.isSaving = false;
                }, function (error) {
                    vm.isSaving = false;
                });
        }
    }
})();
