/**
 * Created by tu on 2016/4/26.
 */
/**
 * Created by tu on 2016/3/31.
 */
define(['react', 'jquery', './dialog', 'bootstraptable'], function (React, $, dialog) {

    var StackTracePanel = React.createClass({
        displayName: "StackTracePanel",
        getInitialState: function () {
            return { loading: true, error: null, data: null };
        },
        componentDidMount: function () {
            $.ajax({
                url: this.props.getDataUrl,
                type: "get",
                dataType: "json",
                data: { id: this.props.logId },
                headers: { token: window.localStorage.getItem("token") },
                success: function (e) {
                    var state = this.state;
                    state.loading = false;
                    state.error = null;
                    state.data = e.StackTrace;
                    this.setState(state);
                }.bind(this),
                error: function () {
                    state.error = "获取堆栈信息失败，与服务器通信失败";
                    this.setState(state);
                }.bind(this)
            });
        },
        render: function () {
            if (this.state.loading) {
                return (React.createElement("span", null, "loading..."));
            }
            else if (this.state.error) {
                return (React.createElement("span", null, "获取异常堆栈失败:", this.state.error));
            }

            var boxStyle = { wordBreak: "break-word", width: "100%" };
            return (React.createElement("div", { style: boxStyle }, this.state.data))
        }
    });

    var LogsGrid = React.createClass({
        displayName: "LogsGrid",
        //mixins:[React.addons.LinkedStateMixin],
        mixins: [React.addons.LinkedModelMixin],
        getInitialState: function () {
            function randomString(len) {
                len = len || 32;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                var maxPos = $chars.length;
                var pwd = '';
                for (i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            }

            return { id: randomString(32), isTableInit: true, selections: [] };
        },
        getSelections: function () {
            if (this.state.selections.length == 0) {
                return null;
            }

            return this.state.selections;
        },
        _onSelection: function () {
            var arr = $('#' + this.state.id).bootstrapTable('getAllSelections');
            if (arr.length == 0) {
                arr = null;
            }

            this.setState({ selections: arr });

            //if(this.props.modelHandler){
            //    this.props.modelHandler.handler(this.props.modelHandler.model,arr);
            //}
        },
        _reload: function () {
            this.setState({ isTableInit: true });
            $('#' + this.state.id).bootstrapTable('refresh');/*,{queryParams: function (e) {
             var para = {
             limit: e.limit,
             start:this.state.isTableInit?0: e.offset,
             //sort: e.sort,//排序字段
             //order: e.order,//升序或者降序
             };

             if(this.props.params) {
             for (var p in this.props.params) {
             para[p] = this.props.params[p];
             }
             }
             return para;
             }});*/
        },
        componentWillReceiveProps: function () {
            this._reload();
        },
        componentDidMount: function () {
            $('#' + this.state.id).bootstrapTable({
                method: 'get',
                url: this.props.getDataUrl,
                cache: false,
                height: 800,
                striped: true,
                pagination: true,
                pageSize: 50,
                checkboxHeader: true,
                pageList: [20, 40, 60, 80, 200],
                search: false,
                showColumns: false,
                showRefresh: true,
                minimumCountColumns: 2,
                detailView: true,
                detailFormatter: function (index, row) {
                    var html = [];
                    $.each(row, function (key, value) {
                        if (key == 0 || value === undefined || key == "ID") {
                            return;
                        }
                        html.push('<p><b>' + key + ':</b> ' + (key.indexOf("Time") != -1 ? value.replace("T", " ") : value) + '</p>');
                    });
                    return html.join('');
                },
                clickToSelect: true,
                sidePagination: "server",
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                queryParams: function (e) {
                    var para = {
                        start: this.state.isTableInit ? 0 : e.offset,
                        limit: e.limit
                        //sort: e.sort,//排序字段
                        //order: e.order,//升序或者降序
                    };

                    if (this.state.params) {
                        for (var p in this.state.params) {
                            para[p] = this.state.params[p];
                        }
                    }
                    return para;
                }.bind(this),
                ajaxOptions: {
                    headers: { token: window.localStorage.getItem("token") }
                },
                responseHandler: function (e) {

                    if (e && e.rows && e.rows.length > 0) {
                        return { rows: e.rows, total: e.total };
                    }
                    else {
                        return { "rows": [], "total": 0 };
                    }
                },
                columns: [{
                    checkbox: true,
                    title: "<input type='checkbox' />",
                    visible: !!this.props.showChecked
                }, {
                    field: "ID",
                    visible: false
                }, {
                    field: "Level",
                    title: "级别",
                    visible: true,
                    sortable: false,
                    formatter: function (v) {
                        var arr = [ "错误","警告"];
                        var res = "";
                        switch (v) {
                            case 0:
                                res = '<span class="btn btn-danger">' + arr[v] + '</span>';
                                break;
                            case 1:
                                res = '<span class="btn btn-warning">' + arr[v] + '</span>';
                                break;
                        }
                        return res;
                    }
                }, {
                    field: "ClientIP",
                    title: "IP",
                    sortable: false
                }, {
                    field: "Thread",
                    title: "线程",
                    visible: false,
                    sortable: false,
                    formatter: function (v) {
                        if (v.length > 30) {
                            return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "Logger",
                    title: "Logger",
                    sortable: false,
                    visible: false,
                    formatter: function (v) {
                        if (v && v.length > 30) {
                            return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "Message",
                    title: "消息",
                    visible: true,
                    sortable: false,
                    formatter: function (v) {
                        if (v && v.length > 100) {
                            return '<span title="' + v + '">' + v.substr(0, 100) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "Exception",
                    title: "Exception",
                    visible: false
                }, {
                    field: "Source",
                    title: "错误源",
                    visible: true,
                    sortable: false,
                    formatter: function (v) {
                        if (v && v.length > 30) {
                            return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "TargetSite",
                    title: "方法名",
                    sortable: false,
                    visible: false,
                    formatter: function (v) {
                        if (v && v.length > 30) {
                            return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "RequestUri",
                    title: "请求URI",
                    sortable: false,
                    visible: true,
                    formatter: function (v) {
                        if (v && v.length > 60) {
                            return '<span title="' + v + '">' + v.substr(0, 60) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "UserAgent",
                    title: "浏览器",
                    sortable: false,
                    visible: false,
                    formatter: function (v) {
                        if (v && v.length > 30) {
                            return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                        }

                        return v;
                    }
                }, {
                    field: "CreateTime",
                    title: "创建时间",
                    sortable: false,
                    formatter: function (v) {
                        if (v) {
                            return v.replace("T", " ");
                        }

                        return v;
                    }
                }, {
                    field: '',
                    title: '堆栈信息',
                    align: 'center',
                    formatter: function (v, row, index) {
                        return '<span class="glyphicon glyphicon-align-justify" style="cursor:pointer;" onclick="openStackTrace(' + row.ID + ')"></span>';
                    }
                }]
            }).on('post-body.bs.table', function () {
                this.setState({ isTableInit: false });
            }.bind(this)).on('check.bs.table', function () {
                this._onSelection();
            }.bind(this)).on('uncheck.bs.table', function () {
                this._onSelection();
            }.bind(this)).on('check-all.bs.table', function () {
                this._onSelection();
            }.bind(this)).on('uncheck-all.bs.table', function () {
                this._onSelection();
            }.bind(this)).on('dbl-click-row.bs.table', function (event, row) {

                dialog.openDialog({
                    title: "堆栈信息",
                    templateComponent: StackTracePanel,
                    templateComponentParams: { getDataUrl: this.props.getStackTraceDataUrl, logId: row.ID }
                });
            }.bind(this));
        },
        render: function () {

            window.openStackTrace = function (id) {
                dialog.openDialog({
                    title: "堆栈信息",
                    templateComponent: StackTracePanel,
                    templateComponentParams: { getDataUrl: this.props.getStackTraceDataUrl, logId: id }
                });
            }.bind(this);

            return (React.createElement("table", { id: this.state.id }));
        }
    });

    return LogsGrid;
});