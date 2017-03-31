/**
 * Created by warriorHuang on 2016/3/21.
 */
define(['appdispatcher','jquery'],function(AppDispatcher) {

    var _MenuManage_CurrID=0;

    function _AddOrEdit(id){
        _MenuManage_CurrID=id;
    }


    var CHANGE_EVENT = 'change';

    var store = assign({}, EventEmitter.prototype, {
        emitAdd: function () {
            this.emit('MenuManage_MenuAdd');
        },
        addAddListener: function (callback) {
            this.on('MenuManage_MenuAdd', callback);
        },
        removeAddListener: function(callback) {
            this.removeListener('MenuManage_MenuAdd', callback);
        },
        getAddOrEditID:function(){
            return _MenuManage_CurrID;
        },
        emitEdit: function () {
            this.emit('MenuManage_MenuEdit');
        },
        addEditListener: function (callback) {
            this.on('MenuManage_MenuEdit', callback);
        },
        removeEditListener: function(callback) {
            this.removeListener('MenuManage_MenuEdit', callback);
        },
        // 触发 change 事件
        emitChange: function () {
            this.emit('MenuManage_MenuChange');
        },
        // 提供给外部 View 绑定 change 事件
        addChangeListener: function (callback) {
            this.on('MenuManage_MenuChange', callback);
        },
        removeChangeListener: function(callback) {
            this.removeListener('MenuManage_MenuChange', callback);
        }
    });

// 注册到 dispatcher，通过动作类型过滤处理当前 Store 关心的动作
    AppDispatcher.register(function (action) {
        switch (action.actionType) {
            case "MenuManage_MenuChange":
                store.emitChange();
                break;
            case "MenuManage_MenuAdd":
                if(action.data){
                    _AddOrEdit(action.data);
                }
                store.emitAdd();
                break;
            case "MenuManage_MenuEdit":
                if(action.data){
                    _AddOrEdit(action.data);
                }
                store.emitEdit();
                break;
        }
    });

    return store;
});
