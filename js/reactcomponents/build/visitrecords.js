/**
 * Created by tu on 2016/3/31.
 */
define(['react','jquery','bootstraptable'], function (React,$) {

    var VisitRecordsGrid=React.createClass({displayName: "VisitRecordsGrid",
        //mixins:[React.addons.LinkedStateMixin],
        mixins:[React.addons.LinkedModelMixin],
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

           return{ id:randomString(32),isTableInit:true,selections:[] };
        },
        getSelections: function () {
            if(this.state.selections.length==0){
                return null;
            }

            return this.state.selections;
        },
        _onSelection: function () {
            var arr= $('#'+this.state.id).bootstrapTable('getAllSelections');
            if(arr.length==0){
                arr=null;
            }

            this.setState({selections:arr});

            //if(this.props.modelHandler){
            //    this.props.modelHandler.handler(this.props.modelHandler.model,arr);
            //}
        },
        _reload: function () {
            this.setState({isTableInit:true});
            $('#'+this.state.id).bootstrapTable('refresh');/*,{queryParams: function (e) {
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
        _handleSearch: function () {
            this._reload();
        },
        componentWillReceiveProps: function () {
            this._reload();
        },
        componentDidMount: function () {
          $('#'+this.state.id).bootstrapTable({
              method: 'get',
              url: this.props.getDataUrl,
              cache: false,
              height: 750,
              striped: true,
              pagination: true,
              pageSize: 20,
              checkboxHeader: true,
              pageList: [20, 40, 60, 80, 200],
              search: false,
              showColumns: false,
              showRefresh: false,
              minimumCountColumns: 2,
              toolbar: "#" + this.state.id + "_toolbar",
              detailView:true,
              detailFormatter:function (index, row) {
                  var html = [];
                  $.each(row, function (key, value) {
                      if(key==0||value===undefined||key=="ID"){
                          return;
                      }
                      html.push('<p><b>' + key + ':</b> ' + (key.indexOf("Time")!=-1?value.replace("T"," "):value) + '</p>');
                  });
                  return html.join('');
              },
              clickToSelect: true,
              sidePagination: "server",
              dataType: "json",
              contentType:"application/x-www-form-urlencoded",
              queryParams: function (e) {
                  var para = {
                      start:this.state.isTableInit?0: e.offset,
                      limit: e.limit,
                      activityName: this.refs.searchText.getDOMNode().value
                      //sort: e.sort,//排序字段
                      //order: e.order,//升序或者降序
                  };

                  if(this.state.params) {
                      for (var p in this.state.params) {
                          para[p] = this.state.params[p];
                      }
                  }
                  return para;
              }.bind(this),
              responseHandler: function (e) {

                  if (e.data && e.data.rows && e.data.rows.length > 0) {
                      return { rows: e.data.rows, total: e.data.total };
                  }
                  else {
                      return { "rows": [], "total": 0 };
                  }
              },
              columns:[{
                  checkbox:true,
                  title: "<input type='checkbox' />",
                  visible: false
              },{
                  field:"ID",
                  visible:false
              },{
                  field:"ClientIP",
                  title:"IP",
                  sortable: false,
                  align: "center"
              },{
                  field: "SourceActivity",
                  title: "来源活动",
                  sortable: false,
                  align:"center"
              },
              {
                  field:"RequestUrl",
                  title:"RequestUrl",
                  visible:false,
                  sortable:false,
                  formatter: function (v) {
                      if (v && v.length > 30) {
                          return '<span title="' + v + '">' + v.substr(0, 30) + '...</span>';
                      }

                      return v;
                  }
              },{
                  field: "UserAgent",
                  title:"平台",
                  sortable:false,
                  visible: true,
                  align:"center",
                  formatter: function (v) {
                      if (!v) {
                          return '-';
                      }                         
                          

                      if (v.toLowerCase().indexOf("iphone") != -1) {
                          return 'IOS';
                      }
                      else if (v.toLowerCase().indexOf("android") != -1) {
                          return 'Android'
                      }
                      else{
                          return '其他';
                      }
                  }
              },{
                  field: "ClientCountry",
                  title:"国家",
                  sortable: false,
                  align: "center"
              },{
                  field: "ClientArea",
                  title:"区域",
                  sortable: false,
                  align: "center"
              },{
                  field: "ClientRegion",
                  title:"省",
                  sortable:false,
                  visible: true,
                  align: "center"
              },{
                  field: "ClientCity",
                  title:"城市",
                  sortable:false,
                  visible: true,
                  align: "center"
              },{
                  field: "ClientISP",
                  title:"网络服务商",
                  sortable: false,
                  align: "center"
              },{
                  field:"CreateTime",
                  title:"访问时间",
                  sortable: false,
                  align:"center",
                  formatter:function(v){
                      return v.replace("T"," ");
                  }
              }]
          }).on('post-body.bs.table', function () {
              this.setState({isTableInit : false});
          }.bind(this)).on('check.bs.table', function () {
                this._onSelection();
          }.bind(this)).on('uncheck.bs.table', function () {
              this._onSelection();
          }.bind(this)).on('check-all.bs.table', function () {
              this._onSelection();
          }.bind(this)).on('uncheck-all.bs.table', function () {
              this._onSelection();
          }.bind(this));
        },
        render: function () {
            var toolbarStyle = { width: "100%", float: "right" };
            var searchGroupStyle = { float: "right" };
            var tableStyle = { marginTop: "5px;" };

            return (React.createElement("div", null,
                React.createElement("div", { id: this.state.id + "toolbar", className: "row" },
                    React.createElement("div", { className: "col-lg-3", style: searchGroupStyle },
                React.createElement("div", { className: "input-group" },
                    React.createElement("input", { type: "text", className: "form-control", placeholder: "活动名称", ref: "searchText" }),
                    React.createElement("span", { className: "input-group-btn" },
                        React.createElement("button", { className: "btn btn-default", type: "button", onClick: this._handleSearch.bind(this) }, React.createElement("span", { className: "glyphicon glyphicon-search" }))
                    )
                )
                        )
                    ),
                React.createElement("table", { id: this.state.id, style: tableStyle })
                ));
        }
    });

    return VisitRecordsGrid;
});
