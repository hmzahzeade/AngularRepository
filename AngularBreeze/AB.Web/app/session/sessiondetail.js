(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$routeParams', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext', sessiondetail]);

    function sessiondetail($location, $scope, $routeParams, $window,
        bsDialog, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var logError = getLogFn(controllerId, 'error');
        var $q = common.$q;

        vm.cancel = cancel;
        vm.deleteSession = deleteSession;
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

        function deleteSession() {
            // bsDialog - is a reference to bootstrap.dialog - injected as dependency
            // boostrap.dialog service is one that we have wrote on top of a bootstrap-UI library to make it simplier to use
            return bsDialog.deleteDialog('Session')
                .then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.session);
                vm.save().then(success, failed);

                function success() { gotoSessions(); }

                function failed(error) { cancel(); }
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
            datacontext.save()
                .then(function (saveResult) {
                    vm.isSaving = false;
                    datacontext.speaker.calcIsSpeaker();
                }, function (error) {
                    vm.isSaving = false;
                });
        }
    }
})();
