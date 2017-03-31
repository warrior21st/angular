define([
    'angular',
    'angularAMD',
    'jquery',
    'services',
    'bootstrap',
    'uiBootstrap',
    'bootstraptable',
    'bootstraptableZhCN',
    'datetimepicker'

], function (angular, angularAMD) {
    'use strict';

    var registerRoutes = function ($stateProvider, $urlRouterProvider) {
        //debugger;

        // default
        $urlRouterProvider.otherwise("/productlist");

        $stateProvider.state("index", angularAMD.route({
            url: "/index",
            templateUrl: "./js/partials/main.html".addFileVersion(),
            controllerUrl: "./js/controllers/main-ctrl.js".addFileVersion()
        }));

        $stateProvider.state("login", angularAMD.route({
            url: "/login",
            templateUrl: "./js/partials/login.html".addFileVersion(),
            controllerUrl: "./js/controllers/login-ctrl.js".addFileVersion()
        }));

        $stateProvider.state("productlist", angularAMD.route({
            url: "/productlist",
            templateUrl: "./js/partials/productlist.html".addFileVersion(),
            controllerUrl: "./js/controllers/productlist-ctrl.js".addFileVersion()
        }));

        $stateProvider.state("indexconfig", angularAMD.route({
            url: "/indexconfig",
            templateUrl: "./js/partials/indexconfig.html".addFileVersion(),
            controllerUrl: "./js/controllers/indexconfig-ctrl.js".addFileVersion()
        }));

        $stateProvider.state("exceptionlog", angularAMD.route({
            url: "/exceptionlog",
            templateUrl: "./js/partials/exceptionlog.html".addFileVersion(),
            controllerUrl: "./js/controllers/exceptionlog-ctrl.js".addFileVersion()
        }));

        //子路由
        $stateProvider.state("indexconfig.test", angularAMD.route({
            url: "/test",
            templateUrl: "./js/partials/particulardata/test.html".addFileVersion(),
            controllerUrl: "./js/controllers/particulardata/test-ctrl.js".addFileVersion()
        }));
    };

    //angular.module('App.controllers', []);

    var app = angular.module('App', [
        'App.services',
        //'App.controllers',
        'ui.router',
        'ui.bootstrap'
    ]);

    // config
    app.config(["$stateProvider", "$urlRouterProvider", registerRoutes]);

    if (!window.localStorage.getItem("token")) {
        window.location.hash = "#login";
    }
    else {
        $.ajax({
            url: "/api/Manager/GetLoginStatus",
            type: "get",
            dataType: "text",
            data: null,
            //contentType: "application/json",
            headers: { token: window.localStorage.getItem("token") || "" },
            success: function (e) {

            },
            error: function (err) {
                window.location.hash = "#login";
            }
        });
    }

    // bootstrap
    return angularAMD.bootstrap(app);
});