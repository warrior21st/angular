define(['services'], function (services) {
    'use strict';

    //管理类目
    angular.module('App.controllers', []).controller('addProductCategoryCtrl', ['$scope', 'service', 'utils', "$uibModalInstance", "modalData",
    function ($scope, service, utils, $uibModalInstance, modalData) {
        $scope.isChoose = false;
        $scope.currChoosed = {
            ID: 0,
            ParentID: -10,
            CategoryName: "",
            CategoryColor: "",
            CategoryImage: ""
        };
        $scope.isFirst = true;
        $scope.isNew = false;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.currCategoryName = "";
        $scope.parentID = -10;
        $scope.parentName = "";
        if (modalData.product) {
            $scope.isChoose = true;
            $scope.parentID = modalData.product.CategoryID;
            $scope.parentName = modalData.product.CategoryName;
        }

        $scope.categories = [
            //{
            //    ID: -1,
            //    CategoryName: "一级类目",
            //    Children: [
            //        {
            //            ID:2,
            //            CategoryName: "一级类目",
            //            Children: [
            //                {
            //                    ID: 3,
            //                    CategoryName: "一级类目",
            //                    Children: []
            //                }
            //            ]
            //        }
            //    ]
            //}
        ];
        $scope.setParentID = function (obj) {
            $scope.parentID = obj.ID;
            $scope.parentName = obj.CategoryName;
            $scope.currChoosed = {
                ID: 0,
                ParentID: obj.ID,
                CategoryName: "",
                CategoryColor: "",
                CategoryImage: ""
            };
            $scope.isNew = true;
            $scope.isFirst = false;
        };

        $scope.chooseCategory = function (obj) {
            $scope.currChoosed = obj;
            $scope.parentID = -10;
            $scope.parentName = "";

            $scope.isNew = false;
            $scope.isFirst = false;
        };

        $scope.choose = function () {
            if ($scope.currChoosed.Children.length > 0) {
                utils.showError("请选择叶子节点");
                return;
            }
            $uibModalInstance.close({ ID: $scope.currChoosed.ID, CategoryName: $scope.currChoosed.CategoryName });
        };

        $scope.deleteCategory = function (obj) {
            if (obj.Children.length > 0) {
                utils.showError("该类目下存在子类目，不可删除");
                return;
            }
            service.request({
                url: "/api/Manager/DeleteCategory",
                method: "post",
                data: obj
            }, function (e) {
               // utils.showSuccess("删除成功");
                $scope.init();
            });
        };

        $scope.chooseCategoryImage = function () {
            document.getElementById('categoryImageFileInput').click();
        };

        $scope.listenInputChange = function () {

            ///获取文件的浏览路径
            var getObjectURL = function (file) {
                var url = null;
                var blob = new Blob([file], { type: file.type });
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(blob);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(blob);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(blob);
                }
                return url;
            };

            document.getElementById('categoryImageFileInput').outerHTML = document.getElementById('categoryImageFileInput').outerHTML;
            $('#categoryImageFileInput').on('change', function () {
                if (this.files.length <= 0) return;
                var file = this.files[0];
                if (file.size > 100 * 1024) {
                    utils.showError("请选择大小不超过100K的图片");
                    return;
                }

                var imageSrc = getObjectURL(file);
                var image = new Image();
                image.onload = function () {
                    var cvs = document.createElement('canvas');
                    cvs.width = 80;
                    cvs.height = 160;
                    cvs.getContext('2d').drawImage(image, 0, 0, cvs.width, cvs.height);
                    $scope.currChoosed.CategoryImage = cvs.toDataURL(file.type, 1);
                    $scope.$apply();
                }
                image.src = imageSrc;
            });

        };

        $scope.submit = function () {
            var requestToServer = function () {
                service.request({
                    url: "/api/Manager/AddOrUpdateCategory",
                    method: "post",
                    data: $scope.currChoosed
                }, function (e) {
                    utils.showSuccess("保存成功");
                    $scope.init();
                });
            };

            if ($scope.isNew) {
                if (!$scope.currChoosed.ParentID) {
                    utils.showError("请选择父级目录");
                    return;
                }
            }

            if ($scope.currChoosed.ParentID == -1) {
                if ($scope.currChoosed.CategoryColor.length != 7 || $scope.currChoosed.CategoryColor[0] != '#') {
                    utils.showError("请输入正确的颜色色值");
                    return;
                }
                if (!$scope.currChoosed.CategoryImage) {
                    utils.showError("请选择产品图片");
                    return;
                }

                if (document.getElementById('categoryImageFileInput').files.length == 0 && !$scope.currChoosed.CategoryImage) {
                    utils.showError("请选择图片");
                    return;
                }

                requestToServer();

                //if (document.getElementById('categoryImageFileInput').files.length > 0) {
                //    if (typeof (FileReader) === 'undefined') {
                //        utils.showError("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
                //        return;
                //    }

                //    var file = document.getElementById('categoryImageFileInput').files[0];
                //    if (!/image\/\w+/.test(file.type)) {
                //        alert("只能选择图片");
                //        return false;
                //    }
                //    var reader = new FileReader();
                //    reader.onload = function (e) {
                //        $scope.currChoosed.CategoryImage = this.result;
                //        requestToServer();
                //    };
                //    reader.readAsDataURL(file);
                //}
            }
            else {
                requestToServer();
            }
        };

        $scope.init = function () {
            service.request({
                url: "/api/Manager/GetCategories",
                method: "get",
                params: null
            }, function (e) {
                $scope.categories = e;

                //for (var i = 0; i < e.length; i++) {
                //    $scope.categories.push(e[i]);
                //}
            });
        };

        $scope.init();



    }]);


    //编辑产品
    angular.module('App.controllers', []).controller('editProductCtrl', ['$scope', 'service', 'utils', '$uibModal', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModal, $uibModalInstance, modalData) {

    $scope.product = {
        CategoryID: 0,
        CategoryName: "",
        ProductName: "",
        ProductSummary: "",
        ProductDescription: "",
        ProductFeature: "",
        ProductLink:""
    };
    if (modalData.product) {
        $scope.product = modalData.product;
        $scope.product.ProductSummary = $scope.product.ProductSummary.replace(/#_NL_#/g, "\n");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
        $scope.product.ProductDescription = $scope.Editor1.getData().replace(/\n/g, "");
        $scope.product.ProductFeature = $scope.Editor2.getData().replace(/\n/g, "");

        if (!$scope.product.CategoryID) {
            utils.showError("请选择产品类目");
            return;
        }

        if (!$scope.product.ProductName) {
            utils.showError("请输入产品名称");
            return;
        }

        if (!$scope.product.ProductSummary) {
            utils.showError("请输入产品简介");
            return;
        }

        console.log($scope.product);
        utils.showMask();
        //return;
        service.request({
            url: "/api/Manager/AddOrUpdateProduct",
            method: "post",
            data: $scope.product
        }, function (e) {
            utils.hideMask();
            utils.showSuccess("保存成功");
            $uibModalInstance.close();
        });

        console.log($scope.product);
        return;

        utils.showSuccess("保存成功");
        $uibModalInstance.close();
    };

    $scope.goChooseCategory = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addProductCategory.html',
            controller: 'addProductCategoryCtrl',
            size: "lg",
            resolve: {
                modalData: function () {
                    return {
                        product: $scope.product
                    }
                }
            }
        });
        modalInstance.result.then(function (e) {
            $scope.product.CategoryID = e.ID;
            $scope.product.CategoryName = e.CategoryName;
            //$scope.$apply();
        }, function (e) {
            console.log("back fail:" + e);
        });
    };

    $scope.setProductColors = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'setProductColor.html',
            controller: 'setProductColorCtrl',
            size: "lg",
            resolve: {
                modalData: function () {
                    return {
                        id: $scope.product.ID
                    };
                }
            }
        });
        modalInstance.result.then(function (e) {
            //console.log("back OK：" + dataBack);

            //$scope.getGameList();
            //$scope.$apply();
        }, function (e) {
            console.log("back fail:" + e);
        });
    };

    $scope.Editor1 = null;
    $scope.Editor2 = null;
    $scope.initEditors = function () {
        $scope.Editor1 = CKEDITOR.replace('productDescriptionEditor', {
            toolbar: [
                    //加粗     斜体，     下划线      穿过线      下标字        上标字
                    ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'],
                    //超链接  取消超链接
                    //['Link', 'Unlink'],
                    //字体 
                    //['Font'],
                    //文本颜色
                    ['TextColor'],
                    //全屏         
                    ['Maximize']
            ],
            height: 150,
            resize_enabled: false,
            font_defaultLabel: "Arial"
        });
        if (modalData.product) {
            $('#productDescriptionEditor').html($scope.product.ProductDescription);
        }

        $scope.Editor2 = CKEDITOR.replace('productFeatureEditor', {
            toolbar: [
                        //加粗     斜体，     下划线      穿过线      下标字        上标字
                        ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'],
                        //超链接  取消超链接
                        //['Link', 'Unlink'],
                        //字体 
                        //['Font'],
                        //文本颜色
                        ['TextColor'],
                        //全屏         
                        ['Maximize']
            ],
            height: 150,
            resize_enabled: false,
            font_defaultLabel: "Arial"
        });
        if (modalData.product) {
            $('#productFeatureEditor').html($scope.product.ProductFeature);
        }
    };


}]);

    angular.module('App.controllers', []).controller('uploadProductImageCtrl', ['$scope', 'service', 'utils', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModalInstance, modalData) {
    $scope.colorID = modalData.id;
    $scope.imageUri = "";

    $scope.init = function () {
        ///获取文件的浏览路径
        var getObjectURL = function (file) {
            var url = null;
            var blob = new Blob([file], { type: file.type });
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(blob);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(blob);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(blob);
            }
            return url;
        };

        document.getElementById('uploadInput').outerHTML = document.getElementById('uploadInput').outerHTML;
        $('#uploadInput').on('change', function () {
            if (this.files.length <= 0) return;
            var file = this.files[0];
            if (file.size > 2048 * 1024) {
                utils.showError("请选择大小不超过2M的图片");
                return;
            }

            var imageSrc = getObjectURL(file);
            var image = new Image();
            image.onload = function () {
                var cvs = document.createElement('canvas');
                cvs.width = 400;
                cvs.height = 400;
                cvs.getContext('2d').drawImage(image, 0, 0, cvs.width, cvs.height);
                $scope.imageUri = cvs.toDataURL(file.type, 1);
                $scope.$apply();
            }
            image.src = imageSrc;
        });
    };

    $scope.chooseImageFile = function () {
        document.getElementById('uploadInput').click();
    };

    $scope.uploadImage = function () {
        if (document.getElementById('uploadInput').files.length == 0) {
            utils.showError("请选择图片");
            return;
        }

        if (typeof (FileReader) === 'undefined') {
            utils.showError("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
            return;
        }

        var file = document.getElementById('uploadInput').files[0];
        if (!/image\/\w+/.test(file.type)) {
            alert("只能选择图片");
            return false;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var imageBase64 = this.result;
            service.request({
                url: "/api/Manager/AddProductImage",
                method: "post",
                data: { ColorID: $scope.colorID, ImageBase64: imageBase64, ImageType: "." + file.name.split('.')[file.name.split('.').length - 1] }
            }, function (e) {
                utils.hideMask();
                $uibModalInstance.close(e);
            });
        };
        utils.showMask();
        reader.readAsDataURL(file);

        //service.request({ url: "/api/Manager/AddProductImage", method: "post", data: fd }, function (e) {
        //    $uibModalInstance.close(e);
        //});
    };
}]);

    //设置颜色及图片
    angular.module('App.controllers', []).controller('setProductColorCtrl', ['$scope', 'service', 'utils', '$uibModal', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModal, $uibModalInstance, modalData) {

    $scope.productID = modalData.id;
    $scope.currColor = {};

    $scope.colors = [
        //{
        //    ID: 1,
        //    ColorValue: "#00ff00",
        //    Images: [
        //        {
        //            ID: 2,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/f5bf849c63e84fbf4e7b9ac7279a45a7"
        //        },
        //        {
        //            ID: 3,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/f5bf849c63e84fbf4e7b9ac7279a45a7"
        //        },
        //        {
        //            ID: 4,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/f5bf849c63e84fbf4e7b9ac7279a45a7"
        //        }
        //    ]
        //},
        //{
        //    ID: 10,
        //    ColorValue: "#ff0000",
        //    Images: [
        //        {
        //            ID: 2,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/96532f4efe72d586690474fda7b760dc"
        //        },
        //        {
        //            ID: 3,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/96532f4efe72d586690474fda7b760dc"
        //        },
        //        {
        //            ID: 4,
        //            ImageUri: "http://cdn.maxjia.com/@/maxnews/imgs/96532f4efe72d586690474fda7b760dc"
        //        }
        //    ]
        //}
    ];

    $scope.setCurrColor = function (obj) {
        $scope.currColor = obj;
    };

    $scope.openImage = function (obj) {
        window.open(obj.ImageUri);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addOrUpdateColor = function (id) {
        swal({
            title: "添加/修改颜色",
            text: "色值（格式：#ff0000）",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "请输入色值"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (!inputValue) {
                swal.showInputError("请输入色值!");
                return false
            }

            if (inputValue.indexOf('#') != 0 || inputValue.length != 7) {
                swal.showInputError("色值格式不正确!");
                return false
            }

            service.request({
                url: "/api/Manager/AddOrUpdateProductColor",
                method: "post",
                data: { ID: id || 0, ProductID: $scope.productID, ColorValue: inputValue },
            }, function (e) {
                $scope.init();
                utils.showSuccess("添加/修改成功");
            });
        });
    };

    $scope.updateCurrColorValue = function () {
        if (!$scope.currColor.ID)
            return;
        $scope.addOrUpdateColor($scope.currColor.ID);
    };

    $scope.deleteColor = function (obj) {
        var id = obj.ID;
        service.request({ url: "/api/Manager/DeleteProductColor", method: "post", data: { ID: id } }, function (e) {
            if ($scope.currColor.ID == obj.ID) {
                $scope.currColor = {};
            }
            $scope.init();
        });
    };

    $scope.addImage = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'uploadProductImage.html',
            controller: 'uploadProductImageCtrl',
            size: "lg",
            resolve: {
                modalData: function () {
                    return {
                        id: $scope.currColor.ID
                    };
                }
            }
        });
        modalInstance.result.then(function (e) {
            $scope.currColor.Images.push(e);


        }, function (e) {
            console.log("back fail:" + e);
        });
    };

    $scope.deleteImage = function (obj) {
        service.request({
            url: "/api/Manager/DeleteProductImage",
            method: "post",
            data: obj
        }, function (e) {
            var id = obj.ID;
            for (var i = 0; i < $scope.currColor.Images.length; i++) {
                if ($scope.currColor.Images[i].ID == id) {
                    $scope.currColor.Images.splice(i, 1);
                    break;
                }
            }
        });
    };

    $scope.init = function () {
        service.request({
            url: "/api/Manager/GetProductColors",
            method: "get",
            params: { productID: $scope.productID }
        }, function (e) {
            $scope.colors = e;
        });
    };
    $scope.init();

}]);


    return ['$scope', 'service', 'utils', '$stateParams', '$uibModal', function ($scope, service, utils, $stateParams, $uibModal) {
        $("._act").removeClass('v_active');
        $("._user").addClass('v_active');
        $("._yichang").removeClass('v_active');

        $scope.searchText = "";

        $scope.goSearch = function () {
            $("#datatable").bootstrapTable('refresh');
        };

        $scope.addProductCategory = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addProductCategory.html',
                controller: 'addProductCategoryCtrl',
                size: "lg",
                resolve: {
                    modalData: function () {
                        return {
                            //id: id //返回活动id
                        }
                    }
                }
            });
            modalInstance.result.then(function (e) {
                $('#datatable').bootstrapTable('refresh');
                //console.log("back OK：" + dataBack);

                //$scope.getGameList();
                //$scope.$apply();
            }, function (e) {
                console.log("back fail:" + e);
            });
        };

        $scope.addProduct = function () {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'editProduct.html',
                controller: 'editProductCtrl',
                size: "lg",
                resolve: {
                    modalData: function () {
                        return {
                        };
                    }
                }
            });
            modalInstance.result.then(function (e) {
                $('#datatable').bootstrapTable('refresh');
                //console.log("back OK：" + dataBack);

                //$scope.getGameList();
                //$scope.$apply();
            }, function (e) {
                console.log("back fail:" + e);
            });
        };

        $scope.showTable = function () {
            function getProductById(id) {
                var row = $('#datatable').bootstrapTable('getRowByUniqueId', id);
                var product = {
                    ID: row.ID,
                    CategoryID: row.CategoryID,
                    CategoryName: row.CategoryName,
                    ProductName: row.ProductName,
                    ProductSummary: row.ProductSummary,
                    ProductDescription: row.ProductDescription,
                    ProductFeature: row.ProductFeature,
                    CreateTime: row.CreateTime
                };

                return product;
            }

            window.editproduct = function (id) {
                var product = getProductById(id);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'editProduct.html',
                    controller: 'editProductCtrl',
                    size: "lg",
                    resolve: {
                        modalData: function () {
                            return {
                                product: product
                            };
                        }
                    }
                });
                modalInstance.result.then(function (e) {
                    $('#datatable').bootstrapTable('refresh');
                    //console.log("back OK：" + dataBack);

                    //$scope.getGameList();
                    //$scope.$apply();
                }, function (e) {
                    console.log("back fail:" + e);
                });
            };

            window.deleteproduct = function (id) {
                var product = getProductById(id);

                service.request({ url: "/api/Manager/DeleteProduct", method: "post", data: product }, function (e) {
                    $('#datatable').bootstrapTable('refresh');
                });
            };

            window.setproductcolor = function (id) {
                //var product = getProductById(id);

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'setProductColor.html',
                    controller: 'setProductColorCtrl',
                    size: "lg",
                    resolve: {
                        modalData: function () {
                            return {
                                id: id
                            };
                        }
                    }
                });
                modalInstance.result.then(function (e) {
                    //console.log("back OK：" + dataBack);

                    //$scope.getGameList();
                    //$scope.$apply();
                }, function (e) {
                    console.log("back fail:" + e);
                });
            }

            $("#datatable").bootstrapTable({
                method: 'get',
                ajaxOptions: {
                    headers: { token: window.localStorage.getItem("token") }
                },
                url: '/api/Manager/GetProductList',
                cache: false,
                height: 500,
                striped: true,
                pagination: true,
                pageSize: 100,
                pageList: [100, 200],
                search: false,
                showColumns: false,
                showRefresh: false,
                minimumCountColumns: 2,
                clickToSelect: false,
                sidePagination: "server",
                dataType: "json",
                queryParams: function (e) {
                    var param = {
                        //start: e.offset,
                        //limit: e.limit,
                        productName: $scope.searchText
                    };

                    return param;
                },

                responseHandler: function (e) {
                    //console.log(e)
                    if (typeof e == "string") {
                        e = JSON.parse(e);
                    }
                    if (e && e.rows && e.rows.length > 0) {
                        return { rows: e.rows, total: e.total };
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
                uniqueId: "ID",
                columns: [
                            { field: 'ID', visible: false },
                            { field: 'ProductName', title: '名称', align: 'center', sortable: false, clickToSelect: false },
                            { field: 'CategoryName', title: '所属分类', align: 'center', sortable: false, clickToSelect: false },
                            {
                                field: 'ProductSummary', title: '简介', align: 'center', sortable: false, clickToSelect: false,visible:false, formatter: function (v) {
                                    return v.replace(/#_NL_#/g, "<br />");
                                }
                            },
                            {
                                field: 'ProductLink', title: '链接', align: 'center', sortable: false, clickToSelect: false, formatter: function (v) {
                                    return '<a href="' + v + '" target="_blank">' + v + '</a>';
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
                            },
                            { field: 'ProductDescription', visible: false },
                            { field: 'ProductFeature', visible: false },
                            {
                                field: '', title: '操作', align: 'center', formatter: function (value, row, index) {
                                    var htmlstr = "<span class='glyphicon glyphicon-pencil editproduct-1' style='cursor:pointer' onclick='editproduct(" + row.ID + ")'></span> | ";
                                    htmlstr += "<span class='glyphicon glyphicon-picture setproductcolor' style='cursor:pointer;color:rgb(51,122,183)' onclick='setproductcolor(" + row.ID + ")'></span> | ";
                                    htmlstr += "<span class='glyphicon glyphicon-trash deleteproduct' style='cursor:pointer;color:rgb(217,83,79)' onclick='deleteproduct(" + row.ID + ")'></span>";

                                    return htmlstr;
                                }
                            }
                ]
            });
        };

    }];
});