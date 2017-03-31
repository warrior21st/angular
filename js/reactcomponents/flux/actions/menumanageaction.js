/**
 * Created by warriorHuang on 2016/3/21.
 */
define(['appdispatcher'], function (AppDispatcher) {
    var action = {};

        action["MenuManage_MenuChange"] = function (data) {
            AppDispatcher.dispatch({
                actionType: "MenuManage_MenuChange",
                data: data
            });
        };

    action["MenuManage_MenuAdd"]=function (data) {
        AppDispatcher.dispatch({
            actionType: "MenuManage_MenuAdd",
            data: data
        });
    };

    action["MenuManage_MenuEdit"]=function (data) {
        AppDispatcher.dispatch({
            actionType: "MenuManage_MenuEdit",
            data: data
        });
    };

    return action;
});
