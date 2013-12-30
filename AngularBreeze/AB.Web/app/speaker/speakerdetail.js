(function () {
    'use strict';

    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$routeParams', '$scope', '$window', 
            'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($routeParams, $scope, $window,
        common, config, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.cancel = cancel;
        vm.activate = activate;
        vm.getTitle = getTitle;
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
        }

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

            return datacontext.speaker.getById(val)
                .then(function(data) {
                    vm.speaker = data;
                }, function (error) {
                    logError('Unable to get speaker ' + val);
                });
        }

        function getTitle() {
            return 'Edit ' + ((vm.speaker && vm.speaker.fullName) || '');
        }

        function goBack() {
            $window.history.back();
        }

        function save() {
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
