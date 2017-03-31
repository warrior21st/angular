define(['services'], function (services) {
    'use strict';

    return ['$scope', 'service', 'utils', '$stateParams', function ($scope, service, utils, $stateParams) {
        $scope.tableInit = true;

        $("#datatable_vkgcmr").bootstrapTable({
            method: 'get',
            url: '/VankeShenzhenMapRedpack/Main/GetWinnerList',
            cache: false,
            height: 600,
            striped: true,
            pagination: true,
            pageSize: 100,
            pageList: [100, 200],
            search: false,
            showColumns: false,
            showRefresh: true,
            minimumCountColumns: 2,
            clickToSelect: false,
            sidePagination: "server",
            dataType: "json",
            queryParams: function (e) {
                var param = {
                    start: $scope.tableInit ? 0 : e.offset,
                    limit: e.limit
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
                var select = "#datatable_vkgcmr";
                $(window).off("resize").on("resize", function () {
                    $(select).bootstrapTable("resetWidth");
                });
            },
            columns: [
                        { field: 'ID', visible: false },
                        { field: 'realname', title: '姓名', align: 'center', sortable: false, clickToSelect: false },
                        { field: 'phonenumber', title: '电话', align: 'center', sortable: false, clickToSelect: false },
                        {
                            field: 'PrizeType', title: '奖品', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                var arr = ["红包", "大米", "福袋"];
                                if (v == 0 || v) {
                                    return arr[v];
                                }

                                return '-';
                            }
                        },
                        {
                            field: 'RedPackValue', title: '红包金额', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                if (!v) {
                                    return "-";
                                }
                                
                                return v;
                            }
                        },
                        {
                            field: 'CreateTime',
                            title: '创建时间',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: function (v) {
                                if (!v) {
                                    return "-"
                                }
                                else {
                                    return v.replace("T", " ");
                                }
                            }
                        }
            ]
        }).on('page-change.bs.table', function (e, size, number) {

            $scope.tableInit = false;
        });

    }];
});