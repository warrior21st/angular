define(['services','react'], function (services,React) {
    'use strict';

    return ['$scope','utils','service', function ($scope,utils,service) {
        $("._act").removeClass('v_active');
        $("._user").removeClass('v_active');
        $("._yichang").addClass('v_active');

        require(['./reactcomponents/build/logs'], function (component) {
            React.render(
                React.createElement(component, { getDataUrl: "/api/Manager/GetLogs", getStackTraceDataUrl: "/api/Manager/GetStackTrace" }),
                document.getElementById('viewdiv')
            );
        });


        $scope.cleanLog = function () {
            service.request({
                url: "/api/Manager/CleanLog",
                method: "post",
                data:null,
            }, function (e) {
                utils.showSuccess("删除成功，请刷新数据");                
            });
        };
    }];
});