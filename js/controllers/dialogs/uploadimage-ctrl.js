define(['services', 'react'], function (services, React) {
    'use strict';

    return angular.module("App.controllers", [])
        .controller('UploadImageCtrl', ['$scope', 'service', 'utils', "$uibModalInstance", "modalData", function ($scope, service, utils, $uibModalInstance, modalData) {
            $scope.tips = modalData.tips || "";
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.imageUri = "";

            $scope.init = function () {
                if (!FileReader) {
                    utils.showError("您的浏览器不支持HTML5，请使用现代浏览器");
                    return;
                }

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

                var getReviseWH = function (srcWidth, srcHeight) {
                    var targetWidth = 400;
                    var targetHeight = 400;
                    var res = {};
                    if (srcWidth > targetWidth || srcHeight > targetHeight) {
                        if (srcWidth > srcHeight) {
                            var heightFloat = parseFloat(srcHeight) / parseFloat(srcWidth);
                            heightFloat = heightFloat * targetWidth;
                            res.height = parseInt(heightFloat);
                            res.width = targetWidth;
                        }
                        else {
                            var widthFloat = parseFloat(srcWidth) / parseFloat(srcHeight);
                            widthFloat = widthFloat * targetWidth;
                            res.width = parseInt(widthFloat);
                            res.height = targetHeight;
                        }
                    }
                    else {
                        res = { width: srcWidth, height: srcHeight };
                        return res;
                    }

                    res = getReviseWH(res.width, res.height);
                    return res;
                };

                document.getElementById('uploadInput').outerHTML = document.getElementById('uploadInput').outerHTML;
                $('#uploadInput').on('change', function () {
                    if (this.files.length <= 0) return;
                    var file = this.files[0];
                    if (file.size > 2048 * 1024) {
                        utils.showError("请选择大小不超过2M的图片");
                        return;
                    }

                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            var w = img.naturalWidth;
                            var h = img.naturalHeight;
                            var wh = getReviseWH(w, h);
                            var cvs = document.createElement('canvas');
                            cvs.width = wh.width;
                            cvs.height = wh.height;
                            cvs.getContext('2d').drawImage(img, 0, 0, cvs.width, cvs.height);
                            $scope.imageUri = cvs.toDataURL(file.type, 1);
                            $scope.$apply();
                        }
                        img.src = this.result;
                    }
                    reader.readAsDataURL(file);
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

                var file = document.getElementById('uploadInput').files[0];
                if (!/image\/\w+/.test(file.type)) {
                    alert("只能选择图片");
                    return false;
                }
                
                var fileUpload = $("#uploadInput").get(0);
                var file = fileUpload.files[0];
                var data = new FormData();
                data.append(file.name, file);
                utils.showMask();
                $.ajax({
                    type: "POST",
                    url: "/api/Manager/UploadFile",
                    headers: {
                        token: window.localStorage.getItem("token")
                    },
                    contentType: false,
                    processData: false,
                    data: data,
                    success: function (e) {
                        console.log(e);
                        $uibModalInstance.close(e);
                    },
                    error: function () {

                        utils.showError("上传失败");
                    },
                    complete: function () {
                        utils.hideMask();
                    }
                });
            };
        }]);
});