define(['services'], function (services) {
    'use strict';

    return ['$scope', 'service', 'utils', '$stateParams', function ($scope, service, utils, $stateParams) {
        $scope.isTableInit = true;
        $scope.prizeNumbersStr = "";
        $scope.prizeType = 0;
        $scope.prizeTypes = [{ name: "全部", value: 0 }, { name: "鸿福奖", value: 1 }, { name: "如意奖", value: 2 }, { name: "吉祥奖", value: 3 }, { name: "幸运奖", value: 4 }];
        $scope.choosePrizeType = function () {
            $scope.isTableInit = true;
            $("#zhhqPWinrizeTable").bootstrapTable('refresh');
        };
        $scope.exportZhhqPWinrizeTable = function () {
            window.location.href = "/zjhtmemberdraw/Main/ExportPrizeInfo";
        };

        service.request({
            url: "/zjhtmemberdraw/Main/PrizeList",
            method: "get",
            paramks: null,
        }, function (e) {
            if (!e.result) {
                alert(e.msg);
                return;
            }

            //todo prizeNumbers
            var parr = e.data;
            $scope.prizeNumbersStr = "";
            for (var i = 0; i < parr.length; i++) {
                $scope.prizeNumbersStr += parr[i].prize + "：" + (parr[i].total - parr[i].surplus) + "/" + parr[i].total + "，";
            }
            $scope.prizeNumbersStr = $scope.prizeNumbersStr.substr(0, $scope.prizeNumbersStr.length - 1);
        });


        $("#zhhqPWinrizeTable").bootstrapTable({
            method: 'get',
            //url: 'data/table_test.json',
            url: '/zjhtmemberdraw/Main/PrizeInfo',
            cache: false,
            height: 650,
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
            formatSearch: function (e) {
                return "输入备注搜索";
            },
            queryParams: function (e) {
                var param = {
                    pagesize: e.limit,
                    pageindex: $scope.tableInit ? 1 : (e.offset / e.limit) + 1,
                    //nameOrPhone:$scope.searchNameOrPhone,
                    type: $scope.prizeType
                };
                return param;
            },
            responseHandler: function (e) {
                //console.log(e)
                if (e.data && e.data.row && e.data.row.length > 0) {
                    return { rows: e.data.row, total: e.data.total };
                } else {
                    return { "rows": [], "total": 0 };
                }
            },
            onPostHeader: function () {
                var select = "#zhhqPWinrizeTable";
                $(window).off("resize").on("resize", function () {
                    $(select).bootstrapTable("resetWidth");
                });
            },
            columns: [
                           {
                               field: "ID",
                               visible: false
                           },
                           {
                               field: 'checkbox',
                               checkbox: true,
                               visible: false
                           },
                       {
                           field: 'name',
                           title: '姓名',
                           align: 'center',
                           sortable: true,
                           clickToSelect: true
                       },
                        {
                            field: 'memberid',
                            title: '会员号',
                            align: 'center',
                            sortable: false,
                            clickToSelect: true
                        },
                       {
                           field: 'prizes',
                           title: '奖品',
                           align: 'center',
                           sortable: false,
                           clickToSelect: true
                       },
                        {
                            field: 'recipient',
                            title: '收件人',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'phone',
                            title: '收件电话',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'address',
                            title: '收件地址',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false
                        },
                        {
                            field: 'createtime',
                            title: '抽奖时间',
                            align: 'center',
                            sortable: false,
                            clickToSelect: false,
                            formatter: function (v) {
                                if (!v) {
                                    return '-';
                                }

                                return v.replace("T", " ");
                            }
                        }

                        /*{
                            field: '',
                            title: '操作',
                            align: 'center',
                            formatter: function () {
                                //if (!$scope.isUndistributed)
                                return '<span class="glyphicon glyphicon-search opendetail" title="编辑" style="cursor:pointer;"></span>'
                                    + '&nbsp;&nbsp;<span style="color:#dddddd">|</span>&nbsp;&nbsp;'
                                    + '<span class="glyphicon glyphicon-remove delete" title="删除" style="cursor:pointer;"></span>'
                                    + '&nbsp;&nbsp;<span style="color:#dddddd">|</span>&nbsp;&nbsp;';
                                //+ '<span class="glyphicon glyphicon-menu-hamburger choosemenus" title="授权菜单" style="cursor:pointer;"></span>';

                                //else
                                //    return '<span class="glyphicon glyphicon-search checkdetail" style="cursor:pointer;"></span>&nbsp;|&nbsp;<span class="glyphicon glyphicon-pushpin distribute" style="cursor:pointer;"></span>';
                            },
                            events: operateEvents
                        }*/]
        }).on('post-body.bs.table', function () {
            $scope.isTableInit = false;
        });





    }];
});