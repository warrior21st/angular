/**
 * Created by warriorHuang on 2016/3/19.
 */

define(['appdispatcher','consts'], function (AppDispatcher,consts) {
    var rootaction = {};
    for (var p in consts) {
        rootaction[p] = function (data) {
            AppDispatcher.dispatch({
                actionType: consts[p],
                data: data
            });
        }
    }

    return rootaction;
});

