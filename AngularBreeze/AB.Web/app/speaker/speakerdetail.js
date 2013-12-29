(function () {
    'use strict';

    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$routeParams', 'common', 'datacontext', speakerdetail]);

    function speakerdetail($routeParams, common, datacontext) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logError = getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.activate = activate;
        vm.getTitle = getTitle;
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;
        
        activate();

        function activate() {
            common.activateController([getRequestedSpeaker()], controllerId);
        }

        //#region Internal Methods        

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
        //#endregion
    }
})();
