! function () {
    "use strict";
    var a = angular.module("app", ["ngAnimate", "ngRoute", "ngSanitize", "common", "common.bootstrap", "ui.bootstrap", "breeze.directives", "ngzWip"]);
    a.run(["$q", "$rootScope", "routemediator",
        function (a, b, c) {
            c.setRoutingEventHandlers(), breeze.core.extendQ(b, a)
        }
    ])
}();;


! function () {
    "use strict";

    function a(a, c, d) {
        function e() {
            a.activateController([h()], b)
        }

        function f() {
            return d.attendee.getCount().then(function (a) {
                return l.attendeeCount = a
            })
        }

        function g() {
            l.attendeeFilteredCount = d.attendee.getFilteredCount(l.attendeeSearch)
        }

        function h(a) {
            return d.attendee.getAll(a, l.paging.currentPage, l.paging.pageSize, l.attendeeSearch).then(function (b) {
                return l.attendees = b, (!l.attendeeCount || a) && f(), g(), b
            })
        }

        function i(a) {
            a && (l.paging.currentPage = a, h())
        }

        function j() {
            return h(!0)
        }

        function k(a) {
            a.keyCode === m.esc && (l.attendeeSearch = ""), h()
        }
        var l = this,
            m = c.keyCodes;
        l.attendeeCount = 0, l.attendeeFilteredCount = 0, l.attendeeSearch = "", l.attendees = [], l.filteredAttendees = [], l.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        }, l.pageChanged = i, l.refresh = j, l.search = k, l.title = "Attendees", Object.defineProperty(l.paging, "pageCount", {
            get: function () {
                return Math.floor(l.attendeeFilteredCount / l.paging.pageSize) + 1
            }
        }), e()
    }
    var b = "attendees";
    angular.module("app").controller(b, ["common", "config", "datacontext", a])
}();;


! function () {
    "use strict";

    function a(a, b) {
        function d(a) {
            var b = "Confirm Delete";
            a = a || "item";
            var c = "Delete " + a + "?";
            return e(b, c)
        }

        function e(b, d, e, f) {
            var g = {
                templateUrl: "modalDialog.tpl.html",
                controller: c,
                keyboard: !0,
                resolve: {
                    options: function () {
                        return {
                            title: b,
                            message: d,
                            okText: e,
                            cancelText: f
                        }
                    }
                }
            };
            return a.open(g).result
        }
        var f = {
            deleteDialog: d,
            confirmationDialog: e
        };
        return b.put("modalDialog.tpl.html", '<div>    <div class="modal-header">        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" data-ng-click="cancel()">&times;</button>        <h3>{{title}}</h3>    </div>    <div class="modal-body">        <p>{{message}}</p>    </div>    <div class="modal-footer">        <button class="btn btn-primary" data-ng-click="ok()">{{okText}}</button>        <button class="btn btn-info" data-ng-click="cancel()">{{cancelText}}</button>    </div></div>'), f
    }
    var b = angular.module("common.bootstrap", ["ui.bootstrap"]);
    b.factory("bootstrap.dialog", ["$modal", "$templateCache", a]);
    var c = ["$scope", "$modalInstance", "options",
        function (a, b, c) {
            a.title = c.title || "Title", a.message = c.message || "", a.okText = c.okText || "OK", a.cancelText = c.cancelText || "Cancel", a.ok = function () {
                b.close("ok")
            }, a.cancel = function () {
                b.dismiss("cancel")
            }
        }
    ]
}();;


! function () {
    "use strict";

    function a(a, b, c, d, e) {
        function f(b, c) {
            return a.all(b).then(function () {
                var a = {
                    controllerId: c
                };
                g(d.config.controllerActivateSuccessEvent, a)
            })
        }

        function g() {
            return b.$broadcast.apply(b, arguments)
        }

        function h(a, b, d, e, f) {
            f = +f || 300, d || (d = "filtered" + b[0].toUpperCase() + b.substr(1).toLowerCase(), e = b + "Filter");
            var g = function () {
                a[d] = a[b].filter(function (b) {
                    return a[e](b)
                })
            };
            return function () {
                var a;
                return function (b) {
                    a && (c.cancel(a), a = null), b || !f ? g() : a = c(g, f)
                }
            }()
        }

        function i(a, b, d, e) {
            var f = 1e3;
            d = d || f, l[a] && (c.cancel(l[a]), l[a] = void 0), e ? b() : l[a] = c(b, d)
        }

        function j(a) {
            return /^[-]?\d+$/.test(a)
        }

        function k(a, b) {
            return a && -1 !== a.toLowerCase().indexOf(b.toLowerCase())
        }
        var l = {}, m = {
            $broadcast: g,
            $q: a,
            $timeout: c,
            activateController: f,
            createSearchThrottle: h,
            debouncedThrottle: i,
            isNumber: j,
            logger: e,
            textContains: k
        };
        return m
    }
    var b = angular.module("common", []);
    b.provider("commonConfig", function () {
        this.config = {}, this.$get = function () {
            return {
                config: this.config
            }
        }
    }), b.factory("common", ["$q", "$rootScope", "$timeout", "commonConfig", "logger", a])
}();;


! function () {
    "use strict";

    function a(a) {
        function b(a, b) {
            switch (b = b || "log", b.toLowerCase()) {
                case "success":
                    b = "logSuccess";
                    break;
                case "error":
                    b = "logError";
                    break;
                case "warn":
                    b = "logWarning";
                    break;
                case "warning":
                    b = "logWarning"
            }
            var c = h[b] || h.log;
            return function (b, d, e) {
                c(b, d, a, void 0 === e ? !0 : e)
            }
        }

        function c(a, b, c, d) {
            g(a, b, c, d, "info")
        }

        function d(a, b, c, d) {
            g(a, b, c, d, "warning")
        }

        function e(a, b, c, d) {
            g(a, b, c, d, "success")
        }

        function f(a, b, c, d) {
            g(a, b, c, d, "error")
        }

        function g(b, c, d, e, f) {
            var g = "error" === f ? a.error : a.log;
            d = d ? "[" + d + "] " : "", g(d, b, c), e && ("error" === f ? toastr.error(b) : "warning" === f ? toastr.warning(b) : "success" === f ? toastr.success(b) : toastr.info(b))
        }
        var h = {
            getLogFn: b,
            log: c,
            logError: f,
            logSuccess: e,
            logWarning: d
        };
        return h
    }
    angular.module("common").factory("logger", ["$log", a])
}();;


! function () {
    "use strict";

    function a(a, b) {
        function c() {
            e(!1)
        }

        function d() {
            e(!0)
        }

        function e(c) {
            a.$broadcast(b.config.spinnerToggleEvent, {
                show: c
            })
        }
        var f = {
            spinnerHide: c,
            spinnerShow: d
        };
        return f
    }
    angular.module("common").factory("spinner", ["common", "commonConfig", a])
}();;


! function () {
    "use strict";

    function a(a, b, c) {
        var d = b.appErrorPrefix,
            e = c.getLogFn("app", "error");
        return function (b, c) {
            if (a(b, c), !d || 0 !== b.message.indexOf(d)) {
                var f = {
                    exception: b,
                    cause: c
                }, g = d + b.message;
                e(g, f, !0)
            }
        }
    }
    var b = angular.module("app");
    b.config(["$provide",
        function (b) {
            b.decorator("$exceptionHandler", ["$delegate", "config", "logger", a])
        }
    ])
}(),

function () {
    "use strict";
    var a = angular.module("app");
    toastr.options.timeOut = 4e3, toastr.options.positionClass = "toast-bottom-right", toastr.options.showMethod = "slideDown", toastr.options.hideMethod = "slideUp";
    var b = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    }, c = {
        imageBasePath: "../content/images/photos/",
        unknownPersonImageSource: "unknown_person.jpg"
    }, d = "breeze/Breeze",
        e = {
            controllerActivateSuccess: "controller.activateSuccess",
            entitiesChanged: "datacontext.entitiesChanged",
            entitiesImported: "datacontext.entitiesImported",
            hasChangesChanged: "datacontext.hasChangesChanged",
            spinnerToggle: "spinner.toggle",
            storage: {
                error: "store.error",
                storeChanged: "store.changed",
                wipChanged: "wip.changed"
            }
        }, f = {
            appErrorPrefix: "[CC Error] ",
            imageSettings: c,
            docTitle: "CC: ",
            events: e,
            keyCodes: b,
            remoteServiceName: d,
            version: "1.1.0"
        };
    a.value("config", f), a.config(["$logProvider",
        function (a) {
            a.debugEnabled && a.debugEnabled(!0)
        }
    ]), a.config(["commonConfigProvider",
        function (a) {
            a.config.controllerActivateSuccessEvent = f.events.controllerActivateSuccess, a.config.spinnerToggleEvent = f.events.spinnerToggle
        }
    ]), a.config(["zStorageConfigProvider",
        function (a) {
            a.config = {
                enabled: !1,
                key: "CCAngularBreeze",
                events: e.storage,
                wipKey: "CCAngularBreeze.wip",
                appErrorPrefix: f.appErrorPrefix,
                newGuid: breeze.core.getUuid,
                version: f.version
            }
        }
    ]), a.config(["zDirectivesConfigProvider",
        function (a) {
            a.zValidateTemplate = '<span class="invalid"><i class="icon-warning-sign"></i>Inconceivable! %error%</span>'
        }
    ])
}(),

function () {
    "use strict";

    function a(a, c) {
        function d(c, d) {
            return d.resolve = angular.extend(d.resolve || {}, {
                prime: b
            }), a.when(c, d), a
        }
        window.testing || (c.forEach(function (a) {
            d(a.url, a.config)
        }), a.otherwise({
            redirectTo: "/"
        }))
    }

    function b(a) {
        return a.prime()
    }

    function c() {
        return [{
            url: "/",
            config: {
                templateUrl: "app/dashboard/dashboard.html",
                title: "dashboard",
                settings: {
                    nav: 1,
                    content: '<i class="icon-dashboard"></i> Dashboard'
                }
            }
        }, {
            url: "/sessions",
            config: {
                title: "sessions",
                templateUrl: "app/session/sessions.html",
                settings: {
                    nav: 2,
                    content: '<i class="icon-calendar"></i> Sessions'
                }
            }
        }, {
            url: "/sessions/search/:search",
            config: {
                title: "sessions-search",
                templateUrl: "app/session/sessions.html",
                settings: {}
            }
        }, {
            url: "/session/:id",
            config: {
                templateUrl: "app/session/sessiondetail.html",
                title: "session",
                settings: {}
            }
        }, {
            url: "/speaker/:id",
            config: {
                templateUrl: "app/speaker/speakerdetail.html",
                title: "speaker",
                settings: {}
            }
        }, {
            url: "/speakers",
            config: {
                templateUrl: "app/speaker/speakers.html",
                title: "speakers",
                settings: {
                    nav: 3,
                    content: '<i class="icon-user"></i> Speakers'
                }
            }
        }, {
            url: "/attendees",
            config: {
                templateUrl: "app/attendee/attendees.html",
                title: "attendees",
                settings: {
                    nav: 4,
                    content: '<i class="icon-group"></i> Attendees'
                }
            }
        }, {
            url: "/workinprogress",
            config: {
                templateUrl: "app/wip/wip.html",
                title: "workinprogress",
                settings: {
                    content: '<i class="icon-asterisk"></i> Work In Progress'
                }
            }
        }]
    }
    var d = angular.module("app");
    d.constant("routes", c()), d.config(["$routeProvider", "routes", a]), b.$inject = ["datacontext"]
}();;
! function () {
    "use strict";

    function a(a, c) {
        function d() {
            var c = [g(), h(), e()];
            f(), a.activateController(c, b)
        }

        function e() {
            return c.session.getTrackCounts().then(function (a) {
                return j.content.tracks = a
            })
        }

        function f() {
            var a = c.speaker.getAllLocal();
            j.speakerCount = a.length, j.speakers.list = c.speaker.getTopLocal()
        }

        function g() {
            return c.attendee.getCount().then(function (a) {
                return j.attendeeCount = a
            })
        }

        function h() {
            return c.session.getCount().then(function (a) {
                return j.sessionCount = a
            })
        }

        function i(a) {
            j.content.predicate = a, j.content.reverse = !j.content.reverse
        }
        var j = this;
        j.map = {
            title: "Location"
        }, j.news = {
            title: "Code Camp",
            description: "Code Camp is a community event where developers learn from fellow developers. All are welcome to attend and speak. Code Camp is free, by and for the deveoper community, and occurs on the weekends."
        }, j.speakers = {
            interval: 5e3,
            list: [],
            title: "Top Speakers"
        }, j.content = {
            predicate: "",
            reverse: !1,
            setSort: i,
            title: "Content",
            tracks: []
        }, j.title = "Dashboard", d()
    }
    var b = "dashboard";
    angular.module("app").controller(b, ["common", "datacontext", a])
}();;
! function () {
    "use strict";

    function a(a, c, d) {
        function e() {
            h("CodeCamper loaded!", null, !0), c.activateController([], b).then(function () {
                g.showSplash = !1
            })
        }

        function f(a) {
            g.isBusy = a
        }
        var g = this,
            h = c.logger.getLogFn(b, "success"),
            i = d.events;
        g.busyMessage = "Please wait ...", g.isBusy = !0, g.showSplash = !0, g.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1,
            trail: 100,
            color: "#F58A00"
        }, e(), a.$on("$routeChangeStart", function () {
            f(!0)
        }), a.$on(i.controllerActivateSuccess, function () {
            f(!1)
        }), a.$on(i.spinnerToggle, function (a) {
            f(a.show)
        })
    }
    var b = "shell";
    angular.module("app").controller(b, ["$rootScope", "common", "config", a])
}();;
! function () {
    "use strict";

    function a(a, b, c, d, e, f) {
        function g() {
            i(), l.wip = e.zStorageWip.getWipSummary()
        }

        function h() {
            function a() {
                e.zStorage.clear()
            }

            function b() { }
            return c.deleteDialog("local storage and work in progress").then(a, b)
        }

        function i() {
            l.navRoutes = f.filter(function (a) {
                return a.config.settings && a.config.settings.nav
            }).sort(function (a, b) {
                return a.config.settings.nav > b.config.settings.nav
            })
        }

        function j(a) {
            if (!a.config.title || !b.current || !b.current.title) return "";
            var c = a.config.title;
            return b.current.title.substr(0, c.length) === c ? "current" : ""
        }

        function k(b) {
            if (b.keyCode === m.esc) return l.searchText = "", void 0;
            if ("click" === b.type || b.keyCode === m.enter) {
                var c = "/sessions/search/";
                a.path(c + l.searchText)
            }
        }
        var l = this,
            m = d.keyCodes;
        l.clearStorage = h, l.isCurrent = j, l.routes = f, l.search = k, l.searchText = "", l.wip = [], l.wipChangedEvent = d.events.storage.wipChanged, g()
    }
    var b = "sidebar";
    angular.module("app").controller(b, ["$location", "$route", "bootstrap.dialog", "config", "datacontext", "routes", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e, f, g, h, i) {
        function j() {
            h.init(z), i.init(z), g.init(z), l(), r(), q(), m()
        }

        function k() {
            z.hasChanges() && (z.rejectChanges(), y("Canceled changes", null, !0))
        }

        function l() {
            A.forEach(function (a) {
                Object.defineProperty(C, a, {
                    configurable: !0,
                    get: function () {
                        var b = g.getRepo(a);
                        return Object.defineProperty(C, a, {
                            value: b,
                            configurable: !1,
                            enumerable: !0
                        }), b
                    }
                })
            })
        }

        function m() {
            a.$on(d.events.storage.storeChanged, function (a, b) {
                w("Updated local storage", b, !0)
            }), a.$on(d.events.storage.wipChanged, function (a, b) {
                w("Updated WIP", b, !0)
            }), a.$on(d.events.storage.error, function (a, b) {
                x("Error with local storage. " + b.activity, b, !0)
            })
        }

        function n(a) {
            return a.entityAspect.setDeleted()
        }

        function o() {
            function a() {
                var a = z.metadataStore;
                f.extendMetadata(a), b(a), h.save()
            }

            function b(a) {
                function b(b, c) {
                    a.setEntityTypeForResourceName(b, c)
                }
                var c = a.getEntityTypes();
                c.forEach(function (a) {
                    a instanceof breeze.EntityType && b(a.shortName, a)
                });
                var d = f.entityNames.person;
                ["Speakers", "Speaker", "Attendees", "Attendee"].forEach(function (a) {
                    b(a, d)
                })
            }

            function c() {
                C.lookup.setLookups(), w("Primed data", C.lookup.cachedData)
            }
            if (t) return t;
            var d = h.load(z),
                e = d ? B.when(w("Loading entities and metadata from local storage")) : B.all([C.lookup.getAll(), C.speaker.getPartials(!0)]).then(a);
            return t = e.then(c)
        }

        function p() {
            function a(a) {
                y("Saved data", a, !0), h.save()
            }

            function b(a) {
                var b = d.appErrorPrefix + "Save failed: " + breeze.saveErrorMessageService.getErrorMessage(a);
                throw a.message = b, x(b, a), a
            }
            return z.saveChanges().to$q(a, b)
        }

        function q() {
            z.entityChanged.subscribe(function (a) {
                a.entityAction === breeze.EntityAction.PropertyChange && (s(a), c.$broadcast(u.entitiesChanged, a))
            })
        }

        function r() {
            z.hasChangesChanged.subscribe(function (a) {
                var b = {
                    hasChanges: a.hasChanges
                };
                c.$broadcast(u.hasChangesChanged, b)
            })
        }

        function s(a) {
            var b = a.args.propertyName;
            ("isPartial" === b || "isSpeaker" === b) && delete a.entity.entityAspect.originalValues[b]
        }
        var t, u = d.events,
            v = c.logger.getLogFn,
            w = v(b),
            x = v(b, "error"),
            y = v(b, "success"),
            z = e.newManager(),
            A = ["attendee", "lookup", "session", "speaker"],
            B = c.$q,
            C = {
                cancel: k,
                markDeleted: n,
                prime: o,
                save: p,
                zStorage: h,
                zStorageWip: i
            };
        return j(), C
    }
    var b = "datacontext";
    angular.module("app").factory(b, ["$rootScope", "common", "config", "entityManagerFactory", "model", "repositories", "zStorage", "zStorageWip", a])
}();;
! function () {
    "use strict";
    var a = angular.module("app");
    a.directive("ccSidebar", function () {
        function a(a, b) {
            function c(a) {
                function b() {
                    d.slideUp(350), $(".sidebar-dropdown a").removeClass(c)
                }
                var c = "dropy";
                a.preventDefault(), e.hasClass(c) ? e.hasClass(c) && (e.removeClass(c), d.slideUp(350)) : (b(), d.slideDown(350), e.addClass(c))
            }
            var d = b.find(".sidebar-inner"),
                e = b.find(".sidebar-dropdown a");
            b.addClass("sidebar"), e.click(c)
        }
        var b = {
            link: a,
            restrict: "A"
        };
        return b
    }), a.directive("ccWidgetClose", function () {
        function a(a, b, c) {
            function d(a) {
                a.preventDefault(), b.parent().parent().parent().hide(100)
            }
            c.$set("href", "#"), c.$set("wclose"), b.click(d)
        }
        var b = {
            link: a,
            template: '<i class="icon-remove"></i>',
            restrict: "A"
        };
        return b
    }), a.directive("ccWidgetMinimize", function () {
        function a(a, b, c) {
            function d(a) {
                a.preventDefault();
                var c = b.parent().parent().next(".widget-content"),
                    d = b.children("i");
                c.is(":visible") ? (d.removeClass("icon-chevron-up"), d.addClass("icon-chevron-down")) : (d.removeClass("icon-chevron-down"), d.addClass("icon-chevron-up")), c.toggle(500)
            }
            c.$set("href", "#"), c.$set("wminimize"), b.click(d)
        }
        var b = {
            link: a,
            template: '<i class="icon-chevron-up"></i>',
            restrict: "A"
        };
        return b
    }), a.directive("ccScrollToTop", ["$window",
        function (a) {
            function b(b, c) {
                function d() {
                    e.scrollTop() > 300 ? c.slideDown() : c.slideUp()
                }
                var e = $(a);
                c.addClass("totop"), e.scroll(d), c.find("a").click(function (a) {
                    a.preventDefault(), $("body").animate({
                        scrollTop: 0
                    }, 500)
                })
            }
            var c = {
                link: b,
                template: '<a href="#"><i class="icon-chevron-up"></i></a>',
                restrict: "A"
            };
            return c
        }
    ]), a.directive("ccSpinner", ["$window",
        function (a) {
            function b(b, c, d) {
                b.spinner = null, b.$watch(d.ccSpinner, function (d) {
                    b.spinner && b.spinner.stop(), b.spinner = new a.Spinner(d), b.spinner.spin(c[0])
                }, !0)
            }
            var c = {
                link: b,
                restrict: "A"
            };
            return c
        }
    ]), a.directive("ccImgPerson", ["config",
        function (a) {
            function b(a, b, e) {
                e.$observe("ccImgPerson", function (a) {
                    a = c + (a || d), e.$set("src", a)
                })
            }
            var c = a.imageSettings.imageBasePath,
                d = a.imageSettings.unknownPersonImageSource,
                e = {
                    link: b,
                    restrict: "A"
                };
            return e
        }
    ]), a.directive("ccWidgetHeader", function () {
        function a(a, b, c) {
            c.$set("class", "widget-head")
        }
        var b = {
            link: a,
            scope: {
                title: "@",
                subtitle: "@",
                rightText: "@",
                allowCollapse: "@"
            },
            templateUrl: "/app/layout/widgetheader.html",
            restrict: "A"
        };
        return b
    }), a.directive("ccWip", ["$route",
        function (a) {
            function b(b, c) {
                function d() {
                    return a.current && a.current.title ? a.current.title.substr(0, e.length) === e : !1
                }
                b.$watch(d, function (a) {
                    a ? c.addClass("current") : c.removeClass("current")
                })
            }

            function c(a) {
                function b() {
                    var b = a.changedEvent;
                    a.$on(b, function (b, c) {
                        a.wip = c.wip
                    }), a.wipRoute = a.routes.filter(function (a) {
                        return a.config.title === e
                    })[0]
                }
                a.wipExists = function () {
                    return !!a.wip.length
                }, a.wipRoute = void 0, a.getWipClass = function () {
                    return a.wipExists() ? "icon-asterisk-alert" : ""
                }, b()
            }

            function d() {
                return '<a href="#{{wipRoute.url}}" ><i class="icon-asterisk" data-ng-class="getWipClass()"></i>Work in Progress ({{wip.length}})</a>'
            }
            var e = "workinprogress",
                f = {
                    controller: ["$scope", c],
                    link: b,
                    template: d(),
                    scope: {
                        wip: "=",
                        changedEvent: "@",
                        routes: "="
                    },
                    restrict: "A"
                };
            return f
        }
    ])
}();;
! function () {
    "use strict";

    function a(a, b) {
        function c() {
            var a = new breeze.MetadataStore;
            return b.configureMetadataStore(a), a
        }

        function d() {
            var a = new breeze.EntityManager({
                serviceName: e,
                metadataStore: f
            });
            return a
        }
        breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", !0), new breeze.ValidationOptions({
            validateOnAttach: !1
        }).setAsDefault(), breeze.NamingConvention.camelCase.setAsDefault();
        var e = a.remoteServiceName,
            f = c(),
            g = {
                metadataStore: f,
                newManager: d
            };
        return g
    }
    var b = "entityManagerFactory";
    angular.module("app").factory(b, ["config", "model", a])
}();;
! function () {
    "use strict";

    function a(a, b) {
        function c(c) {
            var d = a.path(),
                e = d.lastIndexOf("/", d.length - 2),
                f = d.substring(e - 1);
            if (!b.isNumber(f)) {
                var g = d.substring(0, e + 1) + c;
                a.path(g)
            }
        }
        var d = {
            replaceLocationUrlGuidWithId: c
        };
        return d
    }
    var b = "helper";
    angular.module("app").factory(b, ["$location", "common", a])
}();;
! function () {
    "use strict";

    function a(a) {
        function b(b) {
            e(b), f(b), g(b), a.createAndRegister(j)
        }

        function c(b) {
            a.applyValidators(b)
        }

        function d(a) {
            function b(b, d) {
                var e = d || {
                    name: " [Select a " + b.toLowerCase() + "]"
                };
                return a.createEntity(b, e, c)
            }
            if (!i) {
                i = !0;
                var c = breeze.EntityState.Unchanged;
                b(j.timeslot, {
                    start: h,
                    isSessionSlot: !0
                }), b(j.room), b(j.speaker, {
                    firstName: " [Select a person]"
                }), b(j.track)
            }
        }

        function e(a) {
            function b() {
                this.isPartial = !1
            }
            a.registerEntityTypeCtor("Session", b), Object.defineProperty(b.prototype, "tagsFormatted", {
                get: function () {
                    return this.tags ? this.tags.replace(/\|/g, ", ") : this.tags
                },
                set: function (a) {
                    this.tags = a.replace(/\, /g, "|")
                }
            })
        }

        function f(a) {
            function b() {
                this.isPartial = !1, this.isSpeaker = !1
            }
            a.registerEntityTypeCtor("Person", b), Object.defineProperty(b.prototype, "fullName", {
                get: function () {
                    var a = this.firstName,
                        b = this.lastName;
                    return b ? a + " " + b : a
                }
            })
        }

        function g(a) {
            function b() { }
            a.registerEntityTypeCtor("TimeSlot", b), Object.defineProperty(b.prototype, "name", {
                get: function () {
                    var a = this.start,
                        b = a - h === 0 ? " [Select a timeslot]" : a && moment.utc(a).isValid() ? moment.utc(a).format("ddd hh:mm a") : "[Unknown]";
                    return b
                }
            })
        }
        var h = new Date(1900, 0, 1),
            i = !1,
            j = {
                attendee: "Person",
                person: "Person",
                speaker: "Person",
                session: "Session",
                room: "Room",
                track: "Track",
                timeslot: "TimeSlot"
            }, k = {
                configureMetadataStore: b,
                createNullos: d,
                entityNames: j,
                extendMetadata: c
            };
        return k
    }
    var b = "model";
    angular.module("app").factory(b, ["model.validation", a])
}(),
function () {
    "use strict";

    function a(a) {
        function c(a) {
            f(a), g(a), e(a), h(a), n("Validators applied", null, b)
        }

        function d(a) {
            k = a, l = j(), m = i(), o.register(l), o.register(m), n("Validators created and registered", null, b, !1)
        }

        function e(a) {
            var b = a.getEntityType(k.speaker);
            b.getProperty("email").validators.push(o.emailAddress())
        }

        function f(a) {
            var b = ["room", "track", "timeSlot", "speaker"],
                c = a.getEntityType(k.session);
            b.forEach(function (a) {
                c.getProperty(a).validators.push(l)
            })
        }

        function g(a) {
            var b = a.getEntityType(k.speaker);
            b.getProperty("twitter").validators.push(m)
        }

        function h(a) {
            var b = a.getEntityType(k.speaker);
            b.getProperty("blog").validators.push(o.url())
        }

        function i() {
            var a = o.makeRegExpValidator("twitter", /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/, "Invalid Twitter User Name: '%value%'");
            return a
        }

        function j() {
            function a(a) {
                return a ? 0 !== a.id : !1
            }
            var b = "requireReferenceEntity",
                c = {
                    messageTemplate: "Missing %displayName%",
                    isRequired: !0
                }, d = new o(b, a, c);
            return d
        }
        var k, l, m, n = a.logger.getLogFn(b),
            o = breeze.Validator,
            p = {
                applyValidators: c,
                createAndRegister: d
            };
        return p
    }
    var b = "model.validation";
    angular.module("app").factory(b, ["common", a])
}();;
! function () {
    "use strict";

    function a(a, b, c, d, e, f, g) {
        function h(a, b, c) {
            c = c || "item";
            var d = "Delete " + c + "?",
                e = "Confirm Delete";
            return i(a, b, e, d)
        }

        function i(a, b, c, d) {
            var e = [{
                result: "no",
                label: "No",
                cssClass: "btn-primary"
            }, {
                result: "yes",
                label: "Yes"
            }];
            return f.messageBox(c, d, e).open().then(function (c) {
                "yes" === c.toLowerCase() ? a() : b()
            })
        }

        function j() {
            l(!1)
        }

        function k() {
            l(!0)
        }

        function l(b) {
            $broadcast(a.events.spinnerToggle, {
                show: b
            })
        }
        breeze.core.extendQ(d, c);
        var m = {
            logger: b,
            appErrorPrefix: g,
            config: a,
            deleteDialog: h,
            dialogConfirmation: i,
            spinnerHide: j,
            spinnerShow: k
        };
        return m
    }
    var b = "util";
    angular.module("app").factory(b, ["config", "logger", "$q", "$rootScope", "$timeout", "$dialog", "appErrorPrefix", a])
}();;
! function () {
    "use strict";

    function a(a) {
        function b(a) {
            d = a
        }

        function c(b) {
            var c = "repository." + b.toLowerCase(),
                e = a.get(c);
            return new e(d)
        }
        var d, e = {
            getRepo: c,
            init: b
        };
        return e
    }
    var b = "repositories";
    angular.module("app").factory(b, ["$injector", a])
}();;
! function () {
    "use strict";

    function a(a, b) {
        function c() { }

        function d(b) {
            var c = b;
            if (a.isNumber(b) && (b = parseInt(b), c = this.zStorageWip.findWipKeyByEntityId(this.entityName, b), !c)) return this._getById(this.entityName, b);
            var d = this.zStorageWip.loadWipEntity(c);
            return d ? (d.entityAspect.validateEntity(), n.when({
                entity: d,
                key: c
            })) : n.reject({
                error: "Couldn't find entity for WIP key " + c
            })
        }

        function e(a, b, c) {
            return k.from(a).where(c).orderBy(b).using(this.manager).executeLocally()
        }

        function f(a, b, c) {
            function d(c) {
                return (g = c.entity) ? (g.isPartial = !1, e.log("Retrieved [" + a + "] id " + g.id + " from remote data source", g, !0), e.zStorage.save(), g) : (e.log("Could not find [" + a + "] id:" + b, null, !0), null)
            }
            var e = this,
                f = e.manager;
            if (!c) {
                var g = f.getEntityByKey(a, b);
                if (g && !g.isPartial) return e.log("Retrieved [" + a + "] id:" + g.id + " from cache.", g, !0), g.entityAspect.entityState.isDeleted() && (g = null), n.when(g)
            }
            return f.fetchEntityByKey(a, b).to$q(d, e._queryFailed)
        }

        function g(a) {
            return a.inlineCount
        }

        function h(a) {
            var b = k.from(a).where(m.isNotNullo).using(this.manager).executeLocally();
            return b.length
        }

        function i(a) {
            var c = b.appErrorPrefix + "Error retreiving data. " + a.message;
            throw l(c, a), a
        }

        function j(a) {
            for (var b = a.length; b--;) a[b].isPartial = !0;
            return a
        }
        var k = breeze.EntityQuery,
            l = a.logger.getLogFn(this.serviceId, "error"),
            m = {
                isNotNullo: breeze.Predicate.create("id", "!=", 0),
                isNullo: breeze.Predicate.create("id", "==", 0)
            }, n = a.$q;
        return c.extend = function (a) {
            a.prototype = new c, a.prototype.constructor = a
        }, c.prototype.getEntityByIdOrFromWip = d, c.prototype._getAllLocal = e, c.prototype._getById = f, c.prototype._getInlineCount = g, c.prototype._getLocalEntityCount = h, c.prototype._predicates = m, c.prototype._queryFailed = i, c.prototype._setIsPartialTrue = j, c.prototype.log = a.logger.getLogFn(this.serviceId), c.prototype.$q = a.$q, c
    }
    var b = "repository.abstract";
    angular.module("app").factory(b, ["common", "config", a])
}(),
function () {
    "use strict";

    function a(a, c, d, e) {
        function f(a) {
            this.entityName = k, this.manager = a, this.serviceId = b, this.zStorage = e, this.getAll = i, this.getCount = g, this.getFilteredCount = h
        }

        function g() {
            var a = this;
            return a.zStorage.areItemsLoaded("attendees") ? a.$q.when(this._getLocalEntityCount(k)) : l.from("Persons").take(0).inlineCount().using(this.manager).execute().to$q(this._getInlineCount)
        }

        function h(a) {
            var b = n.and(this._predicates.isNotNullo).and(j(a)),
                c = l.from(k).where(b).using(this.manager).executeLocally();
            return c.length
        }

        function i(a, b, c, d) {
            function e(a) {
                var b = g._setIsPartialTrue(a.results);
                return g.zStorage.areItemsLoaded("attendees", !0), g.log("Retrieved [Attendees] from remote data source", b.length, !0), g.zStorage.save(), f()
            }

            function f() {
                var a = g._predicates.isNotNullo;
                d && (a = a.and(j(d)));
                var b = l.from(k).where(a).orderBy(m).take(h).skip(i).using(g.manager).executeLocally();
                return b
            }
            var g = this,
                h = c || 20,
                i = b ? (b - 1) * c : 0;
            return g.zStorage.areItemsLoaded("attendees") && !a ? g.$q.when(f()) : l.from("Persons").select("id, firstName, lastName, imageSource").orderBy(m).toType(k).using(g.manager).execute().to$q(e, g._queryFailed)
        }

        function j(a) {
            return n.create("firstName", "contains", a).or("lastName", "contains", a)
        }
        var k = c.entityNames.attendee,
            l = breeze.EntityQuery,
            m = "firstName, lastName",
            n = breeze.Predicate;
        return d.extend(f), f
    }
    var b = "repository.attendee";
    angular.module("app").factory(b, ["common", "model", "repository.abstract", "zStorage", a])
}(),
function () {
    "use strict";

    function a(a, c, d, e) {
        function f(a) {
            this.entityName = i, this.manager = a, this.serviceId = b, this.zStorage = e, this.getAll = g, this.setLookups = h
        }

        function g() {
            function a(a) {
                return c.createNullos(b.manager), b.log("Retrieved lookups", a, !0), b.zStorage.save(), !0
            }
            var b = this;
            return k.from("Lookups").using(b.manager).execute().to$q(a, b._queryFailed)
        }

        function h() {
            this.cachedData = {
                rooms: this._getAllLocal(j.room, "name"),
                tracks: this._getAllLocal(j.track, "name"),
                timeslots: this._getAllLocal(j.timeslot, "start")
            }
        }
        var i = "lookups",
            j = c.entityNames,
            k = breeze.EntityQuery;
        return d.extend(f), f
    }
    var b = "repository.lookup";
    angular.module("app").factory(b, ["common", "model", "repository.abstract", "zStorage", a])
}(),
function () {
    "use strict";

    function a(a, c, d, e) {
        function f(a) {
            this.entityName = l, this.manager = a, this.serviceId = b, this.zStorage = d, this.zStorageWip = e, this.create = g, this.getById = i, this.getCount = h, this.getPartials = j, this.getTrackCounts = k
        }

        function g() {
            return this.manager.createEntity(l)
        }

        function h() {
            var a = this;
            return a.zStorage.areItemsLoaded("sessions") ? a.$q.when(this._getLocalEntityCount(l)) : m.from("Sessions").take(0).inlineCount().using(this.manager).execute().to$q(this._getInlineCount)
        }

        function i(a, b) {
            return this._getById(l, a, b)
        }

        function j(a) {
            function b(a) {
                return c = d._setIsPartialTrue(a.results), d.zStorage.areItemsLoaded("sessions", !0), d.log("Retrieved [Session Partials] from remote data source", c.length, !0), d.zStorage.save(), c
            }
            var c, d = this;
            return d.zStorage.areItemsLoaded("sessions") && !a ? (c = d._getAllLocal(l, n), d.$q.when(c)) : m.from("Sessions").select("id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags").orderBy(n).toType(l).using(d.manager).execute().to$q(b, d._queryFailed)
        }

        function k() {
            return this.getPartials().then(function (a) {
                var b = a,
                    c = b.reduce(function (a, b) {
                        var c = b.track.name,
                            d = b.track.id;
                        return a[d - 1] ? a[d - 1].count++ : a[d - 1] = {
                            track: c,
                            count: 1
                        }, a
                    }, []);
                return c
            })
        }
        var l = a.entityNames.session,
            m = breeze.EntityQuery,
            n = "timeSlotId, level, speaker.firstName";
        return c.extend(f), f
    }
    var b = "repository.session";
    angular.module("app").factory(b, ["model", "repository.abstract", "zStorage", "zStorageWip", a])
}(),
function () {
    "use strict";

    function a(a, c, d, e) {
        function f(a) {
            this.entityName = m, this.manager = a, this.serviceId = b, this.zStorage = d, this.zStorageWip = e, this.calcIsSpeaker = g, this.create = h, this.getAllLocal = i, this.getById = j, this.getTopLocal = l, this.getPartials = k
        }

        function g() {
            var b = this,
                c = b.manager.getEntities(a.entityNames.person),
                d = b.manager.getEntities(a.entityNames.session);
            c.forEach(function (a) {
                a.isSpeaker = !1
            }), d.forEach(function (a) {
                a.speaker.isSpeaker = 0 !== a.speakerId
            })
        }

        function h() {
            return this.manager.createEntity(m)
        }

        function i(a) {
            var b = p.create("isSpeaker", "==", !0);
            return a && (b = b.or(this._predicates.isNullo)), this._getAllLocal(m, o, b)
        }

        function j(a, b) {
            return this._getById(m, a, b)
        }

        function k(a) {
            function b(a) {
                c = a.results;
                for (var b = c.length; b--;) c[b].isPartial = !0, c[b].isSpeaker = !0;
                return d.log("Retrieved [Speaker Partials] from remote data source", c.length, !0), d.zStorage.save(), c
            }
            var c, d = this;
            return !a && (c = d.getAllLocal(!1), c.length) ? d.$q.when(c) : n.from("Speakers").select("id, firstName, lastName, imageSource").orderBy(o).toType(m).using(d.manager).execute().to$q(b, d._queryFailed)
        }

        function l() {
            var a = p.create("lastName", "==", "Papa").or("lastName", "==", "Guthrie").or("lastName", "==", "Bell").or("lastName", "==", "Hanselman").or("lastName", "==", "Lerman").and("isSpeaker", "==", !0);
            return this._getAllLocal(m, o, a)
        }
        var m = a.entityNames.speaker,
            n = breeze.EntityQuery,
            o = "firstName, lastName",
            p = breeze.Predicate;
        return c.extend(f), f
    }
    var b = "repository.speaker";
    angular.module("app").factory(b, ["model", "repository.abstract", "zStorage", "zStorageWip", a])
}();;
! function () {
    "use strict";

    function a(a, b, d, e, f) {
        function g() {
            h(), i()
        }

        function h() {
            b.$on("$routeChangeError", function (b, d, e, g) {
                if (!j) {
                    j = !0;
                    var h = "Error routing: " + (d && d.name) + ". " + (g.msg || "");
                    f.logWarning(h, d, c, !0), a.path("/")
                }
            })
        }

        function i() {
            b.$on("$routeChangeSuccess", function (a, c) {
                j = !1;
                var d = e.docTitle + " " + (c.title || "");
                b.title = d
            })
        }
        var j = !1,
            k = {
                setRoutingEventHandlers: g
            };
        return k
    }
    var b = angular.module("app"),
        c = "routemediator";
    b.factory(c, ["$location", "$rootScope", "$route", "config", "logger", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e, f, g, h, i, j, k) {
        function l() {
            t(), v(), w(), g.activateController([r()], b).then(u)
        }

        function m(a) {
            g.debouncedThrottle(b, z, 1e3, a)
        }

        function n() {
            i.cancel(), x(), j.replaceLocationUrlGuidWithId(A.session.id), A.session.entityAspect.entityState.isDetached() && o()
        }

        function o() {
            a.path("/sessions")
        }

        function p() {
            return A.hasChanges && !A.isSaving
        }

        function q() {
            function a() {
                function a() {
                    x(), o()
                }

                function b() {
                    n()
                }
                i.markDeleted(A.session), A.save().then(a, b)
            }
            return f.deleteDialog("Session").then(a)
        }

        function r() {
            var a = d.id;
            return "new" === a ? A.session = i.session.create() : i.session.getEntityByIdOrFromWip(a).then(function (a) {
                E = a.key, A.session = a.entity || a
            }, function () {
                C("Unable to get session from WIP " + a), o()
            })
        }

        function s() {
            e.history.back()
        }

        function t() {
            var a = i.lookup.cachedData;
            A.rooms = a.rooms, A.timeslots = a.timeslots, A.tracks = a.tracks, A.speakers = i.speaker.getAllLocal(!0)
        }

        function u() {
            c.$on(h.events.entitiesChanged, function () {
                m()
            })
        }

        function v() {
            c.$on("$destroy", function () {
                m(!0), i.cancel()
            })
        }

        function w() {
            c.$on(h.events.hasChangesChanged, function (a, b) {
                A.hasChanges = b.hasChanges
            })
        }

        function x() {
            i.zStorageWip.removeWipEntity(E)
        }

        function y() {
            return p() ? (A.isSaving = !0, i.save().then(function () {
                A.isSaving = !1, x(), j.replaceLocationUrlGuidWithId(A.session.id), i.speaker.calcIsSpeaker()
            }, function () {
                A.isSaving = !1
            })) : D.when(null)
        }

        function z() {
            if (A.session) {
                var a = A.session.title || "[New Session]" + A.session.id;
                E = i.zStorageWip.storeWipEntity(A.session, E, B, a)
            }
        }
        var A = this,
            B = k.entityNames.session,
            C = g.logger.getLogFn(b, "error"),
            D = g.$q,
            E = void 0;
        A.cancel = n, A.deleteSession = q, A.goBack = s, A.hasChanges = !1, A.isSaving = !1, A.rooms = [], A.save = y, A.session = void 0, A.speakers = [], A.timeslots = [], A.tracks = [], Object.defineProperty(A, "canSave", {
            get: p
        }), l()
    }
    var b = "sessiondetail";
    angular.module("app").controller(b, ["$location", "$scope", "$routeParams", "$window", "bootstrap.dialog", "common", "config", "datacontext", "helper", "model", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e, f, g, h) {
        function i() {
            f.activateController([k()], b).then(function () {
                q = f.createSearchThrottle(o, "sessions"), o.sessionsSearch && q(!0)
            })
        }

        function j(a) {
            a.keyCode === p.esc ? (o.sessionsSearch = "", q(!0)) : q()
        }

        function k(a) {
            return h.session.getPartials(a).then(function (a) {
                return o.sessions = o.filteredSessions = a
            })
        }

        function l(b) {
            b && b.id && a.path("/session/" + b.id)
        }

        function m() {
            k(!0)
        }

        function n(a) {
            var b = f.textContains,
                c = o.sessionsSearch,
                d = c ? b(a.title, c) || b(a.tagsFormatted, c) || b(a.room.name, c) || b(a.track.name, c) || b(a.speaker.fullName, c) : !0;
            return d
        }
        var o = this,
            p = g.keyCodes,
            q = function () { };
        o.filteredSessions = [], o.gotoSession = l, o.refresh = m, o.search = j, o.sessions = [], o.sessionsFilter = n, o.sessionsSearch = e.search || "", o.title = "Sessions", i()
    }
    var b = "sessions";
    angular.module("app").controller(b, ["$location", "$scope", "$route", "$routeParams", "common", "config", "datacontext", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e, f, g, h, i, j) {
        function k() {
            t(), u(), f.activateController([p()], b).then(s)
        }

        function l(a) {
            f.debouncedThrottle(b, x, 1e3, a)
        }

        function m() {
            h.cancel(), v(), i.replaceLocationUrlGuidWithId(y.speaker.id), y.speaker.entityAspect.entityState.isDetached() && n()
        }

        function n() {
            a.path("/speakers")
        }

        function o() {
            return y.hasChanges && !y.isSaving
        }

        function p() {
            var a = d.id;
            return "new" === a ? y.speaker = h.speaker.create() : h.speaker.getEntityByIdOrFromWip(a).then(function (a) {
                C = a.key, y.speaker = a.entity || a
            }, function () {
                r("Unable to get speaker from WIP " + a)
            })
        }

        function q() {
            e.history.back()
        }

        function r(a) {
            A(a), n()
        }

        function s() {
            c.$on(g.events.entitiesChanged, function () {
                l()
            })
        }

        function t() {
            c.$on("$destroy", function () {
                l(!0), h.cancel()
            })
        }

        function u() {
            c.$on(g.events.hasChangesChanged, function (a, b) {
                y.hasChanges = b.hasChanges
            })
        }

        function v() {
            h.zStorageWip.removeWipEntity(C)
        }

        function w() {
            return o() ? (y.isSaving = !0, h.save().then(function () {
                y.isSaving = !1, v(), i.replaceLocationUrlGuidWithId(y.speaker.id)
            }, function () {
                y.isSaving = !1
            })) : B.when(null)
        }

        function x() {
            if (y.speaker) {
                var a = (y.speaker.fullName || "[New speaker]") + " " + y.speaker.id,
                    b = "speaker";
                C = h.zStorageWip.storeWipEntity(y.speaker, C, z, a, b)
            }
        }
        var y = this,
            z = j.entityNames.speaker,
            A = f.logger.getLogFn(b, "error"),
            B = f.$q,
            C = void 0;
        y.cancel = m, y.goBack = q, y.hasChanges = !1, y.isSaving = !1, y.save = w, y.speaker = void 0, y.speakers = [], Object.defineProperty(y, "canSave", {
            get: o
        }), k()
    }
    var b = "speakerdetail";
    angular.module("app").controller(b, ["$location", "$scope", "$routeParams", "$window", "common", "config", "datacontext", "helper", "model", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e) {
        function f() {
            c.activateController([h()], b)
        }

        function g() {
            n.filteredSpeakers = n.speakers.filter(m)
        }

        function h(a) {
            return e.speaker.getPartials(a).then(function (a) {
                return n.speakers = a, g(), a
            })
        }

        function i(b) {
            b && b.id && a.path("/speaker/" + b.id)
        }

        function j() {
            h(!0)
        }

        function k() {
            for (var a = 0; 5 > a; a++) n.speakers.pop();
            g()
        }

        function l(a) {
            a.keyCode === o.esc && (n.speakerSearch = ""), g()
        }

        function m(a) {
            var b = n.speakerSearch ? c.textContains(a.fullName, n.speakerSearch) : !0;
            return b
        }
        var n = this,
            o = d.keyCodes;
        n.filteredSpeakers = [], n.gotoSpeaker = i, n.refresh = j, n.search = l, n.speakerSearch = "", n.speakers = [], n.title = "Speakers", f(), n.removeSpeaker = k
    }
    var b = "speakers";
    angular.module("app").controller(b, ["$location", "common", "config", "datacontext", a])
}();;
! function () {
    "use strict";

    function a(a, c, d, e, f, g) {
        function h() {
            e.activateController([j()], b), a.$on(f.events.storage.wipChanged, function (a, b) {
                m.wip = b
            })
        }

        function i() {
            function a() {
                m.isDeleting = !1
            }

            function b() {
                g.zStorageWip.clearAllWip(), m.isDeleting = !1
            }
            return m.isDeleting = !0, d.deleteDialog("Work in Progress").then(b, a)
        }

        function j() {
            m.wip = g.zStorageWip.getWipSummary()
        }

        function k(a) {
            c.path("/" + a.routeState + "/" + a.key)
        }

        function l(a) {
            m.predicate = a, m.reverse = !m.reverse
        }
        var m = this;
        m.cancelAllWip = i, m.gotoWip = k, m.predicate = "", m.reverse = !1, m.setSort = l, m.title = "Work in Progress", m.wip = [], h()
    }
    var b = "wip";
    angular.module("app").controller(b, ["$scope", "$location", "bootstrap.dialog", "common", "config", "datacontext", a])
}();