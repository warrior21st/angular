
require.config({
    paths: {
        jquery: ["http://libs.baidu.com/jquery/2.0.3/jquery", "./lib/jquery-2.2.0/dist/jquery.min"],
        bootstrap: "./lib/bootstrap-3.3.5-dist/js/bootstrap.min",
        angular: "./lib/angular-1.4.8/angular.min",
        angularRoute: "./lib/angular-1.4.8/angular-route.min",
        angularMocks: "./lib/angular-1.4.8/angular-mocks.min",
        routes: "./routes",
        filters: './filters/filter',
        services: './services/service',
        directives: './directives/directive',
        controllers: './controllers/ctrl',
        angularuirouter: "./lib/ui-router-0.2.15/release/angular-ui-router.min",
        angularAMD: "./lib/angularAMD/angularAMD.min",
        ngload: "./lib/angularAMD/ngload.min",
        app: "./app",
        sweetalert: "./lib/sweetalert/sweetalert.min",
        bootstraptable: "./lib/bootstrap-table-master/dist/bootstrap-table.min",
        uiBootstrap: "./lib/angular-bootstrap/ui-bootstrap-tpls.min",
        bootstraptableZhCN: "./lib/bootstrap-table-master/dist/locale/bootstrap-table-zh-CN.min",
        datetimepicker: "./lib/datetimepicker/jquery.datetimepicker",
        highcharts: "./lib/highchart/highcharts",
        highcharts3d: "./lib/highchart/highcharts-3d",

        react: "./lib/react-0.14.7/build/react-with-addons.min",
        reactdom: "./lib/react-0.14.7/build/react-dom.min",
        flux: './lib/flux/dist/flux.min',
        events: './lib/events/events',
        objectassign: './lib/object-assign/index',
        appdispatcher: './reactcomponents/flux/AppDispatcher',
        consts: './reactcomponents/flux/consts',
        rootstore: './reactcomponents/flux/stores/rootstore',
        rootaction: './reactcomponents/flux/actions/rootaction',
        datetimepicker: "./lib/datetimepicker/jquery.datetimepicker",
        reactaddonextend: "./reactcomponents/build/reactAddonExtend"
    },
    urlArgs: "v=" + window.version,
    shim: {
        // angular
        angular: { exports: "angular" },

        // angularAMD
        angularAMD: ["angular"],
        ngload: ["angularAMD"],
        angularRoute: ["angular"],
        angularuirouter: ["angular"],
        app: ["angular", "angularuirouter"],
        bootstrap: ['jquery'],
        routes: ['jquery'],
        bootstraptable: ['jquery'],
        uiBootstrap: ["angular"],
        bootstraptableZhCN: ['bootstraptable'],
        datetimepicker: ['jquery'],
        highcharts: ['jquery'],
        highcharts3d: ['jquery', 'highcharts'],

        reactdom: ["react"],
        reactaddonextend: ['react']
    },
    deps: [
        'jquery',
        'bootstrap',
        'sweetalert',
         'uiBootstrap',
         'angular',
         'app',
         'datetimepicker',
         'highcharts',
         'react',
         'reactdom'
    ],
    callback: function (angular, uirouter, routes) {
        'use strict';

    }
});
