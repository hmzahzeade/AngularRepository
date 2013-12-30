(function () {
    'use strict';

    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$location', '$routeParams', '$scope', '$window', 
            'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($location, $routeParams, $scope, $window,
        common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var logError = getLogFn(controllerId, 'error');
        var $q = common.$q;

        // Bindable properties and functions are placed on vm.
        vm.cancel = cancel;
        vm.activate = activate;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        // vm.canSave  -  now we can call it on view as vm.canSave not vm.canSave()
        Object.defineProperty(vm, 'canSave', {
            get : canSave
        });

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        }

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSpeaker()], controllerId);
        }

        //#region Internal Methods        

        function cancel() {
            datacontext.cancel();
            //if it is create case - check entity state - return to speakers;
            if (vm.speaker.entityAspect.entityState.isDetached()) {
                gotoSpeakers();
            }
        }

        function gotoSpeakers() { $location.path('/speakers');  }

        function onDestroy() {
            $scope.$on('$destroy', function() {
                datacontext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function(event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function getRequestedSpeaker() {
            var val = $routeParams.id;

            if(val ==='new') {
                vm.speaker = datacontext.speaker.create();
                return vm.speaker;
            }

            return datacontext.speaker.getById(val)
                .then(function(data) {
                    vm.speaker = data;
                }, function (error) {
                    logError('Unable to get speaker ' + val);
                });
        }

        function goBack() {
            $window.history.back();
        }

        function save() {
            if (!canSave()) { return $q.when(null); } // Must return a promise

            vm.isSaving = true;
            datacontext.save().
                then(function(saveResult) {
                    vm.isSaving = false;
                }, function(error) {
                    vm.isSaving = false;
                });
        }
        //#endregion
    }
})();
