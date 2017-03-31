/**
 * Created by warriorHuang on 2016/3/14.
 */
define(['services'], function () {
    'use strict';

    return ['$scope', 'service', 'utils', '$stateParams', function ($scope, service, utils, $stateParams) {
        $('#header').remove();
        $('.leftmenus').hide();
        //$('._login').show();
        $('#mask').height(document.body.scrollHeight);
        $('#mask').width(document.body.scrollWidth);

        $scope.username = "";
        $scope.password = "";
        $scope.submit = function () {

            service.request({
                url: '/api/Manager/Login',
                method: 'GET',
                params: { username: $scope.username, password: $scope.password },
            }, function (e) {
                window.localStorage.setItem("token", e);
                window.location.href = window.location.href.split('#')[0];
            });
        };


        //$.ajax({
        //    url: "http://localhost:24602/PolyLiterature/Main/UploadPoster",
        //    type: "post",
        //    dataType: "json",
        //    data: { uid: 1, postertext: "说出你的文艺主张", width: 640, height: 1040, serverid: "tuqbG2PFw6Zs0Ty6dfxTkRq7cvL1u1dBQnq48Fo31soN1kUN1nq7v_dAKJOJT6O7" },
        //    success: function (e) {
        //        alert(JSON.stringify(e));

        //    },
        //    error: function () {

        //    }
        //});

        // because this has happened asynchroneusly we've missed
        // Angular's initial call to $apply after the controller has been loaded
        // hence we need to explicityly call it at the end of our Controller constructor
        //$scope.$apply();
    }];
});