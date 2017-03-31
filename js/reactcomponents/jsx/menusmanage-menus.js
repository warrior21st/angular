/**
 * Created by warriorHuang on 2016/3/20.
 */
define(['react','jquery','../flux/actions/menumanageaction','../flux/stores/menumanagestore','./Input'], function (React,$,action,store,InputBoxObj) {

    var InputBox=InputBoxObj.InputBox;

    var Menus=React.createClass({
        getInitialState: function () {
            return {loading: false, error: null, data: null,lastActived:{topIndex:0,childIndex:0}};
        },
        showchildren: function (index) {
            var state=this.state;
            state.data[index].showchildren=!state.data[index].showchildren;
            this.setState(state);
        },
        activeMenu: function (topindex,childindex) {
            var state=this.state;
            if(typeof (childindex)==="number") {
                state.data[state.lastActived.topIndex].children[state.lastActived.childIndex].actived = false;
                state.data[topindex].children[childindex].actived = true;
                state.lastActived.topIndex = topindex;
                state.lastActived.childIndex = childindex;
                this.setState(state);

                //todo edit
                action["MenuManage_MenuEdit"].call(window, state.data[topindex].children[childindex].ID);
            }
            else{
                this.showchildren(topindex);
                action["MenuManage_MenuEdit"].call(window, state.data[topindex].ID);
            }
        },
        addMenu: function (parentIndex) {
            action['MenuManage_MenuAdd'].call(window,parentIndex==-1?0:this.state.data[parentIndex].ID);
        },
        _request:function(){
            var state=this.state;
            state.loading=true;
            this.setState(state);
            $.ajax({
                url:this.props.url,
                type:"get",
                dataType:"json",
                data:null,
                success:function(e){
                    state.loading=false;
                    if(!e.result){
                        state.error={message:e.msg};
                    }
                    else
                    {
                        state.data=e.data;
                        for(var i=0,l=state.data.length;i<l;i++){
                            state.data[i].showchildren=true;
                        }
                    }

                    this.setState(state);
                }.bind(this),
                error:function(){
                    state.loading=false;
                    state.error={message:"获取菜单失败：与服务器通信失败"};
                    this.setState(state);
                }.bind(this)
            });
        },
        componentDidMount: function () {
            store.addChangeListener(this._request);
            this._request();
        },
        componentWillUnmount: function() {
            store.removeChangeListener(this._request);
        },
        render: function () {

            var state=this.state;
            if(this.state.loading){
                return (<span>Loading...</span>);
            }
            else if (this.state.error !== null) {
                return (<span>Error: {this.state.error.message}</span>);
            }
            else if(this.state.data==null){
                return (<span></span>);
            }
            else{
                var activeStyle={color:"rgb(0,132,228)"}
                var height10={height:"10px"};
                var height20={height:"20px"};
                var childStyle={paddingLeft:"0px",width:"100%",border:"solid 1px rgb(221,221,221)",borderTop:"none"};
                var btnStyle={display:"flex",justifyContent: "center",alignItems:"center"};
                var width100Style={width:"100%"};
                var noBottomBorderStyle={borderBottom:"none"};

                var menus=state.data;
                var getdiv= function (doms) {
                  return(<div><div style={height10}></div><div id="menumanageleftpanel" className="list-group panel">{doms}</div><div style={height20}></div></div>);
                };

                var items=[];
                for(var i=0;i<menus.length;i++){
                    var topmenu=menus[i];
                    items.push(<a href="javascript:void(0);" className="list-group-item" data-toggle="collapse" data-parent="#menumanageleftpanel" data-target={"#menu"+topmenu.ID} style={width100Style}
                                  onClick={this.activeMenu.bind(this,i)}>
                        <span className={topmenu.showchildren?"glyphicon glyphicon-minus":"glyphicon glyphicon-plus"}></span>
                        <span className="badge">{topmenu.children.length}</span>
                        {topmenu.MenuTitle}
                    </a>);
                    var childrenitems=[];
                    for(var j=0;j<topmenu.children.length;j++){
                        var childmenu=topmenu.children[j];
                        childrenitems.push(<button type="button" className="list-group-item" style={childmenu.actived?activeStyle:{}}
                                                   onClick={this.activeMenu.bind(this,i,j)}>{childmenu.MenuTitle}</button>);
                    }
                    childrenitems.push(<button type="button" className="list-group-item" onClick={this.addMenu.bind(this,i)}
                                               style={noBottomBorderStyle} title="add new child menu.">
                        <span className="glyphicon glyphicon-plus-sign"></span></button>)

                    items.push(<div id={"menu"+topmenu.ID} className="list-group collapse in" style={childStyle}>{childrenitems}</div>);
                }

                items.push(<a href="javascript:void(0);" className="list-group-item" style={btnStyle}  title="add new topmenu."
                              onClick={this.addMenu.bind(this,-1)}>
                    <span className="glyphicon glyphicon-plus"></span>
                </a>)

                return getdiv(items);
            }
        }

    });


    var EditPanel=React.createClass({
        mixins: [React.addons.LinkedStateMixin,React.addons.LinkedModelMixin],
        _getInitData: function () {
          return {
              MenuTitle: "",
              MenuKey: "",
              MenuIcon: "",
              MenuCode: "",
              MenuRemark: "",
              OrderNum: "",
              IsValid: true,
              IsDeleted:false
          };
        },
        getInitialState:function(){
            return {
                loading:false,
                error:null,
                data:this._getInitData() ,
                hide:true,
                topMenus:[{ID:0,MenuTitle:"顶级菜单"}]
            };
        },

        verifyFormData: function () {
            for(var p in this.refs){
                if(!this.refs[p].state.changed){
                    this.refs[p].updateStatus();
                }
            }

            for(var p in this.refs){
                if(!this.refs[p].getValid()){
                    return false;
                }
            }

            return true;
        },
        initRefs: function () {
            for(var p in this.refs){
                this.refs[p].init();
            }
        },
        save: function () {
            if(!this.verifyFormData()){
                return;
            }

            var params={};
            for(var p in this.state.data){
              if(this.state.data[p]==="") {
                  continue;
              }
              else{
                  params[p]=this.state.data[p];
              }
            }

            $.ajax({
                url:this.props.saveUrl,
                type:"post",
                dataType:"json",
                data:{data:JSON.stringify(params)},
                success: function (e) {
                    if(!e.result){
                        alert(e.msg);
                        return;
                    }

                    action["MenuManage_MenuChange"].call(window);

                    this.setState({changed:false});
                    alert("保存成功");
                }.bind(this),
                error:function(){
                    alert("保存失败，与服务器通信失败");
                }.bind(this)
            });
        },
        _add: function () {
            var id=store.getAddOrEditID();
            var state=this.state;
            state.data=this._getInitData();
            state.data.ParentID=id;
            state.hide=false;
            state.error=null;
            this.setState(state);
            this._initTopMenus();
        },
        _edit: function () {
            var id=store.getAddOrEditID();
            if(id==this.state.data.ID){
                return;
            }
            this._request(id);
        },
        remove: function () {
            $.ajax({
                url:this.props.deleteUrl,
                type:"post",
                dataType:"json",
                data:{data:JSON.stringify(this.state.data.ID)},
                success: function (e) {
                    if(!e.result){
                        alert(e.msg);
                        return;
                    }

                    var state=this.state;
                    state.data.IsDeleted=false;
                    this.setState(state);
                    action["MenuManage_MenuChange"].call(window);
                }.bind(this),
                error:function(){
                    alert("删除失败，与服务器通信失败");
                }.bind(this)
            });
        },
        _request:function(id){
            var state=this.state;
            state.loading=true;
            state.hide=false;
            state.data.IsDeleted=false;
            state.error=null;
            this.setState(state);

            $.ajax({
                url:this.props.getDataUrl,
                type:"get",
                dataType:"json",
                data:{id:id},
                success: function (e) {
                    //state.loading=false;
                    if(!e.result){
                        state.err={msg:e.msg};
                        this.setState(state);
                        return;
                    }

                    state.data=e.data;
                    this.setState(state);
                    this._initTopMenus();
                }.bind(this),
                error:function(err){
                    //state.loading=false;
                    state.error={msg:err.message};
                    this.setState(state);
                }.bind(this)
            });
        },
        setNextOrderNum: function () {
            var state = this.state;
            $.ajax({
                url:this.props.getNextOrderNumUrl,
                type:"get",
                dataType:"json",
                data:{parentId:state.data.ParentID||0},
                success: function (e) {
                    if(e.result) {
                        this.refs.ordernum.setValue(e.data);
                    }
                    else{
                        alert(e.msg);
                    }
                }.bind(this),
                error: function () {
                    alert("获取最大排序号失败，与服务器通信失败");
                }
            });
        },
        _initTopMenus: function () {

            this.setState({loading:true});
            $.getJSON(this.props.getTopMenusUrl,null, function (e) {
                if(e.result){
                    var state=this.state;
                    state.loading=false;
                    state.topMenus=e.data;
                    state.topMenus.splice(0,0,{ID:0,MenuTitle:"顶级菜单"});
                    this.setState(state);
                    this.initRefs();
                }
            }.bind(this));

        },
        componentDidMount: function () {
            store.addAddListener(this._add);
            store.addEditListener(this._edit);
        },
        componentWillUnmount: function() {
            store.removeAddListener(this._request);
            store.removeEditListener(this._edit);
        },
        render:function(){
            var state=this.state;

            if(state.loading){
                return(<span>loading...</span>);
            }

            if(state.error){
                return(<span>error:{state.error.msg}</span>);
            }

            if(state.hide){
                return (<span></span>);
            }

            var mainStyle={marginTop:"10px",marginBottom:"20px;"}
            var rowStyle={display:"flex",justifyContent: "flex-end",alignItems:"center",marginTop:"10px"}
            var marginTop10Style={marginTop:"10px"};
            var buttonDivStyle={display:"flex",justifyContent: "center",alignItems:"center",marginTop:"10px"};
            var aStyle={textDecoration: "underline",color:"rgb(0,132,228)"};
            var textRight={textAlign: "right"};
            var data=state.data;

            var topMenus=this.state.topMenus.map(function (menu,index) {
                return(<option value={menu.ID}>{menu.MenuTitle}</option>);
            });

            return (<div style={mainStyle}>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>名称</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <InputBox type="text" className="form-control" placeholder="输入名称" modelHandler={{model:"data.MenuTitle",handler:this.handleDataChange.bind(this) }}
                                  maxLength="20" defaultValue={this.state.data.MenuTitle} required="true" ref="menutitle"></InputBox>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>Key</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <InputBox type="english" className="form-control" placeholder="输入Key"  modelHandler={{model:'data.MenuKey',handler:this.handleDataChange.bind(this)}}
                                  maxLength="20" defaultValue={this.state.data.MenuKey} required="false" ref="menukey"></InputBox>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>图标</strong></span>
                    </div>
                    <div className="col-lg-9">
                        <InputBox type="english" className="form-control" placeholder="输入图标样式"  modelHandler={{model:'data.MenuIcon',handler:this.handleDataChange.bind(this)}}
                                  maxLength="60" defaultValue={this.state.data.MenuIcon} required="false" ref="menuicon"></InputBox>
                    </div>
                    <div className="col-lg-2">
                        <a href="http://v3.bootcss.com/components" target="_blank" style={aStyle}>查看Glyphicons样式</a>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>父菜单</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <select className="form-control" valueLink={this.linkModel("data.ParentID")}>
                            {topMenus}
                        </select>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>Code</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <InputBox type="englishOrSymbol" className="form-control" placeholder="输入Code"  modelHandler={{model:'data.MenuCode',handler:this.handleDataChange.bind(this)}}
                                  maxLength="36" defaultValue={this.state.data.MenuCode} required="true" ref="menucode"></InputBox>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>备注</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <InputBox type="textarea" className="form-control" placeholder="输入备注"  modelHandler={{model:'data.MenuRemark',handler:this.handleDataChange.bind(this)}}
                                  maxLength="100" defaultValue={this.state.data.MenuRemark} required="false" ref="menuremark"></InputBox>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>排序号</strong></span>
                    </div>
                    <div className="col-lg-11">
                            <InputBox type="number" className="form-control" placeholder="输入排序号" modelHandler={{model:"data.OrderNum",handler:this.handleDataChange.bind(this)}}
                                      minLength="1" maxLength="10" defaultValue={this.state.data.OrderNum} required="true" ref="ordernum"
                                        addon={{location:"right",content:(<span className="input-group-btn"><button type="=button" className="btn btn-default" onClick={this.setNextOrderNum.bind(this)}>设为最大值</button></span>)}}></InputBox>
                    </div>
                </div>
                <div className="row" style={rowStyle}>
                    <div className="col-lg-1" style={textRight}>
                        <span><strong>状态</strong></span>
                    </div>
                    <div className="col-lg-11">
                        <label><input type="checkbox" checkedLink={this.linkModel('data.IsValid')} /><strong>启用</strong></label>
                    </div>
                </div>
                <div className="row" style={buttonDivStyle}>
                    <div className="col-lg-1">
                        {!this.state.changed|| this.state.data.IsDeleted?(<button type="button" className="btn btn-info" onClick={this.save.bind(this)} disabled="true">保存</button>):
                            (<button type="button" className="btn btn-info" onClick={this.save.bind(this)} >保存</button>)}

                    </div>
                    <div className="col-lg-1"></div>
                    <div className="col-lg-1">
                        {this.state.data.ID?(<button type="button" className="btn btn-danger" onClick={this.remove.bind(this)} >删除</button>):
                            (<button type="button" className="btn btn-danger" onClick={this.remove.bind(this)} disabled="true">删除</button>)}

                    </div>
                </div>
            </div>);
        }
    });

    return {Menus:Menus,EditPanel:EditPanel};
});