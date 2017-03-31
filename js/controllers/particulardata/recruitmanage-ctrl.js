/**
 * Created by tu on 2016/2/17.
 */
define(['services'], function (services) {
    'use strict';

    return ['$scope', '$http', function ($scope, $http) {

        $scope.tableInit = true;
        $scope.searchText = "";
        $scope.goSearch = function () {
            $scope.tableInit = true;
            $("#datatable").bootstrapTable('refresh');
        };


        window.operateEvents = {
            'click  .opendetail': function (e, value, row, index) {

                $http({
                    url: '/Home/GetActivityDetailById',
                    method: 'GET',
                    params: { id: row.ID }
                }).success(function (e, header, config, status) {//响应成功
                    if (!e.result) {
                        alert(e.msg);
                        return;
                    }

                    $scope.editData = {
                        ID: e.data.ID,
                        ActivityName: e.data.ActivityName,
                        CreateTime: e.data.CreateTime.replace("T", " "),
                        ShareTitle: e.data.ShareTitle,
                        ShareDescription: e.data.ShareDescription,
                        ShareLink: e.data.ShareLink,
                        ShareImage: e.data.ShareImage,
                        IsValid: e.data.IsValid
                    };

                    $('#editpanel').modal();

                }).error(function (e, header, config, status) {//处理响应失败
                    alert("获取详情失败：与服务器通信失败");
                });
            },
            'click  .delete': function (e, value, row, index) {
                $http({
                    url: '/Home/DeleteActivity',
                    method: 'POST',
                    params: { id: row.ID }
                }).success(function (e, header, config, status) {//响应成功
                    if (!e.result) {
                        alert(e.msg);
                        return;
                    }

                    alert("删除成功");
                    $scope.goSearch();

                }).error(function (e, header, config, status) {//处理响应失败
                    alert("删除失败：与服务器通信失败");
                });
            }
        };

        $("#datatable").bootstrapTable({
            method: 'get',
            //url: 'data/table_test.json',
            url: '/Recruit/Main/GetRecruitData',
            cache: false,
            height: 750,
            striped: true,
            pagination: true,
            pageSize: 100,
            pageList: [100, 200],
            search: false,
            showColumns: false,
            showRefresh: true,
            minimumCountColumns: 2,
            clickToSelect: true,
            sidePagination: "server",
            dataType: "json",
            queryParams: function (e) {
                var param = {
                    start: $scope.tableInit ? 0 : e.offset,
                    limit: e.limit,
                    sort: e.sort,
                    order: e.order
                    //nameOrPhone:$scope.searchNameOrPhone,
                    //activityName: $scope.searchText
                };
                return param;
            },
            responseHandler: function (e) {
                //console.log(e)
                if (e.data && e.data.rows && e.data.rows.length > 0) {
                    return { rows: e.data.rows, total: e.data.total };
                } else {
                    return { "rows": [], "total": 0 };
                }
            },
            onPostHeader: function () {
                var select = "#datatable";
                $(window).off("resize").on("resize", function () {
                    $(select).bootstrapTable("resetWidth");
                });
            },
            columns: [
                           {
                               field: "ID",
                               title: "ID",
                               visible: false,
                               align: 'center'
                           },
                           {
                               field: 'checkbox',
                               checkbox: true,
                               visible: false
                           },
                       {
                           field: 'RealName',
                           title: '姓名',
                           align: 'center',
                           sortable: false,
                           clickToSelect: false
                       },
                        {
                            field: 'PhoneNumber',
                            title: '电话',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'ShowType',
                            title: '职位',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'ShowInfo',
                            title: 'ShowInfo',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            visible: false
                        },
                        {
                            field: 'CreateTime',
                            title: '创建时间',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: function (v) {
                                return v.replace("T", " ");
                            }
                        }
                        //,
                        //{
                        //    field: '',
                        //    title: '操作',
                        //    align: 'center',
                        //    formatter: function () {
                        //        //if (!$scope.isUndistributed)
                        //        return '<span class="glyphicon glyphicon-search opendetail colorf5bb48" title="编辑" style="cursor:pointer;"></span>&nbsp;&nbsp;<span style="color:#dddddd">|</span>&nbsp;&nbsp;<span class="glyphicon glyphicon-remove delete colorf5bb48" title="删除" style="cursor:pointer;"></span>';
                        //        //else
                        //        //    return '<span class="glyphicon glyphicon-search checkdetail" style="cursor:pointer;"></span>&nbsp;|&nbsp;<span class="glyphicon glyphicon-pushpin distribute" style="cursor:pointer;"></span>';
                        //    },
                        //    events: operateEvents
                        //}
            ]
        }).on('post-body.bs.table', function () {
            $scope.isTableInit = false;
        });

        // because this has happened asynchroneusly we've missed
        // Angular's initial call to $apply after the controller has been loaded
        // hence we need to explicityly call it at the end of our Controller constructor
        //$scope.$apply();
    }];
});