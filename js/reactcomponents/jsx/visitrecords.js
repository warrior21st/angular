/**
 * Created by tu on 2016/3/31.
 */
define(['react','jquery','bootstraptable'], function (React,$) {

    var VisitRecordsGrid=React.createClass({
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

           return{ id:randomString(32),isTableInit:true,selections:[], };
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
        componentWillReceiveProps: function () {
            this._reload();
        },
        componentDidMount: function () {
          $('#'+this.state.id).bootstrapTable({
              method: 'get',
              url: "http://localhost:53475/System/GetLogList",
              cache: false,
              height: 800,
              striped: true,
              pagination: true,
              pageSize: 20,
              checkboxHeader: true,
              pageList: [20, 40, 60, 80, 200],
              search: false,
              showColumns: false,
              showRefresh: true,
              minimumCountColumns: 2,
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
                      limit: e.limit
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
                  title:"<input type='checkbox' />"
              },{
                  field:"ID",
                  visible:false
              },{
                  field:"ClientIP",
                  title:"IP",
                  sortable:false
              },{
                  field:"RequestUrl",
                  title:"RequestUrl",
                  visible:true,
                  sortable:false,
                  formatter: function (v) {
                      if(v.length>30){
                          return '<span title="'+v+'">'+v.substr(0,30)+'...</span>';
                      }

                      return v;
                  }
              },{
                  field:"Reffer",
                  title:"Reffer",
                  visible:false,
                  sortable:false,
                  formatter: function (v) {
                      if(v.length>30){
                          return '<span title="'+v+'">'+v.substr(0,30)+'...</span>';
                      }

                      return v;
                  }
              },{
                  field:"UserAgent",
                  title:"UserAgent",
                  sortable:false,
                  visible:true,
                  formatter: function (v) {
                      if(v.length>30){
                          return '<span title="'+v+'">'+v.substr(0,30)+'...</span>';
                      }

                      return v;
                  }
              },{
                  field:"UserOS",
                  title:"UserOS",
                  visible:true,
                  sortable:false,
                  formatter: function (v) {
                      if(v.length>30){
                          return '<span title="'+v+'">'+v.substr(0,30)+'...</span>';
                      }

                      return v;
                  }
              },{
                  field:"UserProvince",
                  title:"UserProvince",
                  sortable:false
              },{
                  field:"UserCity",
                  title:"UserCity",
                  sortable:false
              },{
                  field:"UserLatitude",
                  title:"UserLatitude",
                  sortable:false,
                  visible:false
              },{
                  field:"UserLongitude",
                  title:"UserLongitude",
                  sortable:false,
                  visible:false
              },{
                  field:"UserIsp",
                  title:"UserIsp",
                  sortable:false
              },{
                  field:"CreationTime",
                  title:"CreationTime",
                  sortable:false,
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
            return (<table id={this.state.id}></table>);
        }
    });

    return VisitRecordsGrid;
});
