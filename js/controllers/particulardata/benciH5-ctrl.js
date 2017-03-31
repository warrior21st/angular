/**
 * Created by tu on 2016/2/17.
 */
define(['services'], function (services) {
    'use strict';

    return ['$scope', '$http', function ($scope, $http) {

        $scope.tableInit = true;
        //$scope.searchText = "";
        //$scope.goSearch = function () {
        //    $scope.tableInit = true;
        //    $("#datatable").bootstrapTable('refresh');
        //};

        $scope.benciExport = function () {
            location.href="/BmwGame/Manager/ExportBallots?nameorphoneonly=0&answeronly=0";
        };
        $("#datatable").bootstrapTable({
            method: 'get',
            url: '/BmwGame/Manager/GetBallotList',
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
                };
                return param;
            },
            responseHandler: function (e) {
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
                        //{
                        //    field: "ID",
                        //    title: "ID",
                        //    visible: false,
                        //    align: 'center'
                        //},
                        //{
                        //    field: 'checkbox',
                        //    checkbox: true,
                        //    visible: false
                        //},
                       {
                           field: 'realname',
                           title: '姓名(4s店)',
                           align: 'center',
                           sortable: false,
                           clickToSelect: false
                       },
                        {
                            field: 'phonenumber',
                            title: '电话',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'answer1',
                            title: 'CLA',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter:carSelect
                        },
                        {
                            field: 'answer2',
                            title: 'GLA',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: carSelect
                        },
                        {
                            field: 'answer3',
                            title: 'A级车',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: carSelect
                        },
                        {
                            field: 'answer4',
                            title: 'B级车',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: carSelect
                        },
                        {
                            field: 'createtime',
                            title: '创建时间',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: function (v) {
                                return v;
                            }
                        }
            ]
        }).on('post-body.bs.table', function () {
            $scope.isTableInit = false;
        });
        //选择车
        function carSelect(v) {
            if (v === "0") {
                return "A款车";
            } else if (v === "1") {
                return "B款车";
            } else {
                return "";
            }
        }
    }];
});