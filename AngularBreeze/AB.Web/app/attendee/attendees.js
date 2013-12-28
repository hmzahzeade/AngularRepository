(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'attendees';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['datacontext', 'common', 'config', attendees]);

    function attendees(datacontext, common, config) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.attendees = [];
        vm.attendeeCount = 0;
        vm.attendeeFilteredCount = 0;
        vm.attendeeSearch = '';
        vm.filteredAttendees = [];
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Attendees';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.attendeeFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            var promises = [getAttendees()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Attendees View'); });
        }

        function getAttendeeCount() {
            return datacontext.attendee.getCount().then(function (data) {
                return vm.attendeeCount = data;
            });
        }

        function getAttendeeFilteredCount() {
            vm.attendeeFilteredCount = datacontext.attendee.getFilteredCount(vm.attendeeSearch);
        }

        //#region Internal Methods        
        function getAttendees(forceRefresh) {
            return datacontext.attendee.getAll(forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.attendeeSearch)
                .then(
                    function (data) {
                        vm.attendees = data;
                        getAttendeeFilteredCount();
                        if(!vm.attendeeCount || forceRefresh) {
                            getAttendeeCount();
                        }
                        return data;
                    }
                );
        }

        function refresh() {
            getAttendees(true);
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getAttendees();
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.attendeeSearch = '';
            }
            getAttendees();
        }
        //#endregion
    }
})();
