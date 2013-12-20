(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'attendees';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['datacontext', 'common', attendees]);

    function attendees(datacontext, common) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm.
        vm.refresh = refresh;
        vm.title = 'Attendees';
        vm.attendees = [];

        activate();

        function activate() {
            var promises = [getAttendees()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Attendees View'); });
        }

        //#region Internal Methods        
        function getAttendees(forceRefresh) {
            return datacontext.getAttendees(forceRefresh).then(function (data) {
                return vm.attendees = data;
            });
        }

        function refresh() {
            getAttendees(true);
        }
        //#endregion
    }
})();
