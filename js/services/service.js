define(['angular'], function (angluar) {
    'use strict';

    /* Services */

    // Demonstrate how to register services
    // In this case it is a simple value service.

    var services = angular.module('App.services', []);

    /* Services */
    var utils = function () {

    };

    utils.prototype.host = window.location.protocol + "//" + window.location.host;

    utils.prototype.showSuccess = function (msg) {
        swal({ title: "系统提示", text: msg, type: "success", timer: 1500, showConfirmButton: false });
    };

    utils.prototype.showError = function (msg) {
        swal({ title: "系统提示", text: msg, type: "error" });
    };

    utils.prototype.showWarning = function (msg) {
        swal({ title: "系统提示", text: msg, type: "warning" });
    };

    utils.prototype.showInfo = function (msg) {
        swal({ title: "系统提示", text: msg, type: "info", timer: "3000", showConfirmButton: false });
    };

    utils.prototype.showMask = function () {
        if(!duocument.getElementById('mask_public')){
            $(document.body).append('<div id="mask_public" style="display: none; z-index: 8888; position: absolute;' +
                'left: 0; right: 0; top: 0; bottom: 0; width: 100%; height: 100%; background: #000; filter: alpha(opacity=50); ' +
                '-moz-opacity: 0.5; -khtml-opacity: 0.5; opacity: 0.3; _height: expression(document.documentElement.clientHeight);' +
                ' _width: expression(document.documentElement.clientWidth);">'+
                '<div style="z-index: 9999; position: absolute; left: 50%; top: 50%; overflow: hidden;">'+
                '<canvas id = "loading-canvas"  width="30" height="30"></canvas>'+
                +'</div>'
                +'</div>');

            var Loading = function (canvas, options) {
                this.canvas = document.getElementById(canvas);
                this.options = options;
            };
            Loading.prototype = {
                constructor: Loading,
                show: function () {
                    var canvas = this.canvas,
                        begin = this.options.begin,
                        old = this.options.old,
                        lineWidth = this.options.lineWidth,
                        canvasCenter = {x: canvas.width / 2, y: canvas.height / 2},
                        ctx = canvas.getContext("2d"),
                        color = this.options.color,
                        num = this.options.num,
                        angle = 0,
                        lineCap = this.options.lineCap,
                        CONST_PI = Math.PI * (360 / num) / 180;
                    window.timer = setInterval(function () {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        for (var i = 0; i < num; i += 1) {
                            ctx.beginPath();
                            ctx.strokeStyle = color[num - 1 - i];
                            ctx.lineWidth = lineWidth;
                            ctx.lineCap= lineCap;
                            ctx.moveTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
                                begin, canvasCenter.y + Math.sin(CONST_PI * i + angle) * begin);
                            ctx.lineTo(canvasCenter.x + Math.cos(CONST_PI * i + angle) *
                                old, canvasCenter.y + Math.sin(CONST_PI * i + angle) * old);
                            ctx.stroke();
                            ctx.closePath();
                        }
                        angle += CONST_PI;
                        //console.log(angle)
                    },50);
                },

                hide: function () {
                    clearInterval(window.timer);
                }
            };
            (function () {
                var options = {
                    num : 10,
                    begin: 6,
                    old: 12,
                    lineWidth: 3,
                    lineCap: "round",
                    color: ["rgb(153, 153, 153)", "rgb(187, 187, 187)","rgb(221, 221, 221)", "rgb(255, 255, 255)"]
                };
                var loading = new Loading("loading-canvas", options);
                loading.show();
            }());
        }
        $('#mask_public').show();
    };

    utils.prototype.hideMask = function () {
        $('#mask_public').hide();
    }

    utils.prototype.getUserRole = function () {
        if (window.localStorage.getItem("role")) {
            return window.localStorage.getItem("role");
        }
        else {
            return null;
        }
    }

    utils.prototype.alert1 = function () {
        alert(1);
    };

    services.service('utils', utils);

    services.service('service', ['$http', function ($http) {

        var service = {};

        service.request = function (obj, func, customerErrorTips) {
            obj.headers = obj.headers || {
                "Content-Type": "application/json",
                "token": window.localStorage.getItem("token") || ""
            };

            $http(obj).success(function (e) {
                //if (!e.result && e.msg == "登录超时") {
                //    window.location.hash = "#/login";
                //    return;
                //}

                //if (!e.result && !customerErrorTips) {
                //    swal({ title: "系统提示", text: data.msg, type: "error" });
                //    return;
                //}
                //if (typeof e == "string"&&obj.url.indexOf) {
                    
                //    e = JSON.tr(e);
                //}

                func(e);

            }).error(function (errMsg, errCode,e,x,t) {
                if (errCode == 419) {
                    window.location.hash = "#login";
                    return;
                }
                if (errCode == 490) {//业务异常
                    swal({ title: "系统提示", text: errMsg, type: "error" });                    
                }
                else//系统异常
                {
                    swal({ title: "系统提示", text: JSON.stringify({ errCode: errCode, Message: errMsg }), type: "error" });
                }
            });
        };

        return service;

    }]);

    return services;
});