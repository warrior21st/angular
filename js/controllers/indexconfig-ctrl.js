define(['services'], function (services) {
    'use strict';

    //添加底部小图标
    angular.module('App.controllers', []).controller('addBottomIconCtrl', ['$scope', 'service', 'utils', '$uibModal', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModal, $uibModalInstance, modalData) {
    $scope.icon = {
        ImageUri: "",
        Link: ""
    };

    $scope.ok = function () {
        if ($scope.icon.Link.length <= 0) {
            utils.showError("请输入链接");
            return;
        }

        $uibModalInstance.close($scope.icon);
    };

    $scope.chooseImage = function () {
        document.getElementById('iconUploadInput').click();
    };

    $scope.initInput = function () {
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

        document.getElementById('iconUploadInput').outerHTML = document.getElementById('iconUploadInput').outerHTML;

        $('#iconUploadInput').on('change', function () {
            if (this.files.length <= 0) return;
            var file = this.files[0];
            if (file.size > 50 * 1024) {
                utils.showError("请选择大小不超过50K的图片");
                return;
            }

            var imageSrc = getObjectURL(file);
            var image = new Image();
            image.onload = function () {
                var cvs = document.createElement('canvas');
                cvs.width = 47;
                cvs.height = 47;
                cvs.getContext('2d').drawImage(image, 0, 0, cvs.width, cvs.height);
                $scope.icon.ImageUri = cvs.toDataURL(file.type, 1);
                $scope.$apply();
            }
            image.src = imageSrc;
        });
    };
}]);

    //添加链接项
    angular.module('App.controllers', []).controller('addLineLinkCtrl', ['$scope', 'service', 'utils', '$uibModal', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModal, $uibModalInstance, modalData) {
    $scope.lineObj = {
        lineText: "",
        lineLink: ""
    };

    $scope.ok = function () {
        if ($scope.lineObj.lineText.length <= 0 || $scope.lineObj.lineLink.length <= 0) {
            utils.showError("请输入完整");
            return;
        }

        $uibModalInstance.close($scope.lineObj);
    };
}]);


    //设置链接组
    angular.module('App.controllers', []).controller('setLineCtrl', ['$scope', 'service', 'utils', '$uibModal', "$uibModalInstance", "modalData",
function ($scope, service, utils, $uibModal, $uibModalInstance, modalData) {
    var lineObj = modalData.line;
    $scope.target = modalData.target;

    $scope.lineArr = [];
    var i = 1;
    for (var p in lineObj) {
        $scope.lineArr.push({ ID: i, lineText: p, lineLink: lineObj[p] });
    }

    $scope.textChange = function () {
        console.log($scope.lineArr);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addLink = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addLineLink.html',
            controller: 'addLineLinkCtrl',
            size: "sm",
            resolve: {
                modalData: function () {
                    return {

                    };
                }
            }
        });
        modalInstance.result.then(function (e) {
            e.ID = $scope.lineArr.length + 1;
            $scope.lineArr.push(e);

        }, function (e) {
            console.log("back fail:" + e);
        });
    };

    $scope.removeLink = function (obj) {
        for (var i = 0; i < $scope.lineArr.length; i++) {
            if ($scope.lineArr[i].ID == obj.ID) {
                $scope.lineArr.splice(i, 1);
            }
        }
    };

    $scope.ok = function () {
        var lineObj = {};
        for (var i = 0; i < $scope.lineArr.length; i++) {
            lineObj[$scope.lineArr[i].lineText] = $scope.lineArr[i].lineLink
        }
        $uibModalInstance.close({ target: $scope.target, line: lineObj });
    };
}]);


    return ['$scope', 'service', 'utils', '$stateParams', '$uibModal', function ($scope, service, utils, $stateParams, $uibModal) {
        $("._act").addClass('v_active');
        $("._user").removeClass('v_active');
        $("._yichang").removeClass('v_active');

        $scope.GetLineStr = function (obj) {

            var str = "";
            for (var p in obj) {
                str += p + " | ";
            }
            str = str.substr(0, str.length - 3);

            return str;
        };

        $scope.config = {
            TopLine: { x: "x" },
            Image1Uri: "",
            Image1Link: "",
            Image2Uri: "",
            Image2Link: "",
            Image3Uri: "",
            Image3Link: "",
            AboutUsImageUri: "",
            AboutUsLink: "",
            FacebookImageUri: "",
            FacebookLink: "",
            HelpImageUri: "",
            HelpLink: "",
            BottomIcons: [{ ID: 0, ImageUri: "y", Link: "" }],
            BottomEmailAddress: "",
            BottomLine: { z: "z" }
        };

        function clone(obj) {
            var o;
            switch (typeof obj) {
                case 'undefined': break;
                case 'string': o = obj + ''; break;
                case 'number': o = obj - 0; break;
                case 'boolean': o = obj; break;
                case 'object':
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var k in obj) {
                                o[k] = clone(obj[k]);
                            }
                        }
                    }
                    break;
                default:
                    o = obj; break;
            }
            return o;
        }

        $scope.submit = function () {
            var obj = clone($scope.config);
            obj.BottomIcons = {};
            var arr = $scope.config.BottomIcons;
            for (var i = 0; i < arr.length; i++) {
                obj.BottomIcons[arr[i].Link] = arr[i].ImageUri;
            }
            
            //return;
            utils.showMask();
            service.request({ url: "/api/Manager/SaveIndexConfig", method: "post", data: obj }, function (e) {
                utils.hideMask();
                utils.showSuccess("保存成功");
            });

        };

        $scope.chooseImage = function (target) {
            switch (target) {
                case "image1":
                    document.getElementById('image1').click();
                    break;
                case "image2":
                    document.getElementById('image2').click();
                    break;
                case "image3":
                    document.getElementById('image3').click();
                    break;
                case "aboutus":
                    document.getElementById('image4').click();
                    break;
                case "facebook":
                    document.getElementById('image5').click();
                    break;
                case "help":
                    document.getElementById('image6').click();
                    break;
            }
        };

        $scope.setLine = function (obj, target) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'setLine.html',
                controller: 'setLineCtrl',
                //size: "lg",
                resolve: {
                    modalData: function () {
                        return {
                            line: obj,
                            target: target
                        };
                    }
                }
            });
            modalInstance.result.then(function (e) {
                if (target == "top") {
                    $scope.config.TopLine = e.line;
                }
                else if (target == "bottom") {
                    $scope.config.BottomLine = e.line;
                }

            }, function (e) {
                console.log("back fail:" + e);
            });
        };

        $scope.addBottomIcon = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'addBottomIcon.html',
                controller: 'addBottomIconCtrl',
                size: "sm",
                resolve: {
                    modalData: function () {
                        return {
                        };
                    }
                }
            });
            modalInstance.result.then(function (e) {
                $scope.config.BottomIcons.push({
                    ID: $scope.config.BottomIcons.length - 1,
                    ImageUri: e.ImageUri,
                    Link: e.Link
                });

            }, function (e) {
                console.log("back fail:" + e);
            });
        };

        $scope.removeBottomIcon = function (obj) {
            for (var i = 0; i < $scope.config.BottomIcons.length; i++) {
                if (obj.ID == $scope.config.BottomIcons[i].ID) {
                    $scope.config.BottomIcons.splice(i, 1);
                }
            }
        };

        $scope.initFileInput = function () {
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

            for (var i = 1; i <= 6; i++) {
                $('#image' + i).on('change', function () {
                    if (this.files.length <= 0) return;
                    var file = this.files[0];
                    if (typeof (FileReader) === 'undefined') {
                        utils.showError("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
                        return;
                    }
                    if (file.size > 2048 * 1024) {
                        utils.showError("请选择大小不超过2M的图片");
                        return;
                    }

                    var target = $(this).attr("data-image");

                    if (!/image\/\w+/.test(file.type)) {
                        alert("只能选择图片");
                        return false;
                    }

                    var imageSrc = getObjectURL(file);
                    var image = new Image();
                    var width = 0;
                    var height = 0;

                    switch (target) {
                        case "image1":
                            width = 957;
                            height = 600;
                            break;
                        case "image2":
                            width = 473;
                            height = 295;
                            break;
                        case "image3":
                            width = 473;
                            height = 295;
                            break;
                        case "aboutus":
                            width = 472;
                            height = 331;
                            break;
                        case "facebook":
                            width = 472;
                            height = 331;
                            break;
                        case "help":
                            width = 472;
                            height = 331;
                            break;
                    }

                    image.onload = function () {
                        var cvs = document.createElement('canvas');
                        cvs.width = width;
                        cvs.height = height;
                        cvs.getContext('2d').drawImage(image, 0, 0, cvs.width, cvs.height);
                        var result = cvs.toDataURL(file.type, 1);
                        utils.hideMask();
                        switch (target) {
                            case "image1":
                                $scope.config.Image1Uri = result;
                                break;
                            case "image2":
                                $scope.config.Image2Uri = result;
                                break;
                            case "image3":
                                $scope.config.Image3Uri = result;
                                break;
                            case "aboutus":
                                $scope.config.AboutUsImageUri = result;
                                break;
                            case "facebook":
                                $scope.config.FacebookImageUri = result;
                                break;
                            case "help":
                                $scope.config.HelpImageUri = result;
                                break;
                        }
                        $scope.$apply();
                    }
                    utils.showMask();
                    image.src = imageSrc;

                    return;

                    //    var reader = new FileReader();
                    //    reader.onload = function (e) {
                    //        utils.hideMask();
                    //        switch (target) {
                    //            case "image1":
                    //                $scope.config.Image1Uri = this.result;
                    //                break;
                    //            case "image2":
                    //                $scope.config.Image2Uri = this.result;
                    //                break;
                    //            case "image3":
                    //                $scope.config.Image3Uri = this.result;
                    //                break;
                    //            case "aboutus":
                    //                $scope.config.AboutUsImageUri = this.result;
                    //                break;
                    //            case "facebook":
                    //                $scope.config.FacebookImageUri = this.result;
                    //                break;
                    //            case "help":
                    //                $scope.config.HelpImageUri = this.result;
                    //                break;
                    //        }
                    //        $scope.$apply();
                    //    };
                    //    utils.showMask();
                    //    reader.readAsDataURL(file);

                });
            }
        };

        $scope.init = function () {
            utils.showMask();
            service.request({
                url: "/api/Manager/GetIndexConfig",
                method: "get",
                params: null
            }, function (e) {
                utils.hideMask();
                var arr = [];
                $scope.config = e;
                var i = 0;
                for (var p in e.BottomIcons) {
                    arr.push({ ID: i, ImageUri: p, Link: e.BottomIcons[p] });
                    i++;
                }
                $scope.config.BottomIcons = arr;
            });
        };
        $scope.init();
    }];
});