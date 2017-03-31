define(['services'], function (services) {
    'use strict';

    return ['$scope', 'service', 'utils', '$stateParams', function ($scope, service, utils, $stateParams) {
        $scope.onlynameorphone1 = 0;
        $scope.tableInit = true;
        $scope.onlynameorphoneChange = function (obj) {
            $scope.onlynameorphone1 = obj.onlynameorphone1;
            $scope.tableInit = true;

            $('#vankeChoiceTable').bootstrapTable('refresh');
        };

        $scope.exportVankeChoiceData = function () {
            window.location.href = "/VankeShake/Manager/ExportChoiceList?onlynameorphone=" + $scope.onlynameorphone1;
        };

        $("#vankeChoiceTable").bootstrapTable({
            method: 'get',
            url: '/VankeShake/Manager/GetChoiceList',
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
                    limit: e.limit,
                    onlynameorphone: $scope.onlynameorphone1
                };
                console.log($scope.activityId);
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
                var select = "#vankeChoiceTable";
                $(window).off("resize").on("resize", function () {
                    $(select).bootstrapTable("resetWidth");
                });
            },
            columns: [
                        { field: 'ID', visible: false },
                        { field: 'RealName', title: '真实姓名', align: 'center', sortable: false, clickToSelect: false },
                        { field: 'PhoneNumber', title: '手机', align: 'center', sortable: false, clickToSelect: false },
                        {
                            field: 'HomeCity', title: '家乡', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                var arr = ["广东仔", "辣妹子", "湖北佬", "上海银", "胡建人", "其他"];
                                if (v == 0 || v) {
                                    return arr[v];
                                }

                                return '-';
                            }
                        },
                        {
                            field: 'CuisineChoice', title: '最喜欢的姿态', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                if (v == 0 || v) {
                                    var str = v.toString().replace("0", "创业沃土,").replace("1", "美食之都,").replace("2", "娱乐会场,").replace("3", "魅力都会,").replace("4", "潮流圣地,").replace("5", "购物天堂,");
                                    if (str[str.length - 1] == ",") {
                                        str = str.substring(0, str.length - 1);
                                    }

                                    return str;
                                }
                                else { return "-"; }
                            }
                        },
                        {
                            field: 'LikeCapsicum', title: '一般去哪', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                if (v == 0 || v) {
                                    var str = v.toString().replace("0", "万科广场,").replace("1", "欢乐海岸,").replace("2", "OCT创意园,").replace("3", "Cocopark,").replace("4", "海上世界,").replace("5", "海岸城,");
                                    if (str[str.length - 1] == ",") {
                                        str = str.substring(0, str.length - 1);
                                    }

                                    return str;
                                }
                                else { return "-"; }
                            }
                        },
                        {
                            field: 'FavouriteCuisine', title: '最爱的深圳菜', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                if (v == 0 || v) {
                                    var str = v.toString().replace("0", "盆菜,").replace("1", "茶果,").replace("2", "肠粉,").replace("3", "椰子鸡,").replace("4", "食薄饼,").replace("5", "潮汕打冷,");
                                    if (str[str.length - 1] == ",") {
                                        str = str.substring(0, str.length - 1);
                                    }

                                    return str;
                                }
                                else { return "-"; }
                            }
                        },
                        {
                            field: 'WinPrize', title: '是否获奖', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                if (v == 0) { return "否"; }
                                else if (v == 1) { return "是"; }
                                else { return "-" }
                            }
                        },
                        { field: 'ReceiveStatus', visible: false },
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