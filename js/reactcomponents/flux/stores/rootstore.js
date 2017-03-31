/**
 * Created by warriorHuang on 2016/3/19.
 */
    define(['appdispatcher','consts'],function(AppDispatcher,consts) {

        var CHANGE_EVENT = 'change';
        window._todos = {};

// 先定义一些数据处理方法
        function addTab(tabData) {
            //var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
            //id = "tab0";
            window._todos=tabData;
        }

        var rootstore = assign({}, EventEmitter.prototype, {
            // Getter 方法暴露给外部获取 Store 数据
            getAll: function () {
                return window._todos;
            },
            // 触发 change 事件
            emitChange: function () {
                this.emit(CHANGE_EVENT);
            },
            // 提供给外部 View 绑定 change 事件
            addChangeListener: function (callback) {
                this.on(CHANGE_EVENT, callback);
            },
            /**
             * @param {function} callback
             */
            removeChangeListener: function(callback) {
                this.removeListener(CHANGE_EVENT, callback);
            }
        });

// 注册到 dispatcher，通过动作类型过滤处理当前 Store 关心的动作
        AppDispatcher.register(function (action) {
            switch (action.actionType) {
                case consts.AddTab:
                    if (action.data) {
                        addTab(action.data);
                    }
                    rootstore.emitChange();
                    break;
            }
        });

        return rootstore;
    });
