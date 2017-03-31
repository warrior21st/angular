/**
 * Created by warriorHuang on 2016/3/21.
 */
define(['react','jquery','../flux/actions/menumanageaction','../flux/stores/menumanagestore'], function (React,$,action,store) {

    var EditPanel=React.createClass({displayName: "EditPanel",
        mixins: [React.addons.LinkedStateMixin],
        getInitialState:function(){
            return {
                loading:false,
                error:null,
                data: {
                    MenuTitle: "",
                    MenuKey: "",
                    MenuIcon: "",
                    MenuCode: "",
                    MenuRemark: "",
                    OrderNum: "",
                    IsValid: true,
                    IsDeleted:false
                },
                hide:true,
                topMenus:[{ID:0,MenuTitle:"顶级菜单"}]
            };
        },
        save: function () {
            $.ajax({
               url:this.props.saveUrl,
                type:"post",
                dataType:"json",
                data:{data:JSON.stringify(this.state.data)},
                success: function (e) {
                    if(!e.result){
                        alert(e.msg);
                        return;
                    }

                    action["MenuManage_MenuChange"].call(window);
                }.bind(this),
                error:function(){
                    alert("保存失败，与服务器通信失败");
                }.bind(this)
            });
        },
        _add: function () {
            var id=store.getAddOrEditID();
            var state=this.state;
            state.data.ParentID=id;
            state.hide=false;
            state.error=null;
            this.setState(state);
            this._initTopMenus();
        },
        _edit: function () {
            var id=store.getAddOrEditID();
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
            state.data.IsDeleted=false;
            state.error=null;
            this.setState(state);

            this._initTopMenus();

            $.ajax({
               url:this.props.getDataUrl,
                type:"get",
                dataType:"json",
                data:{id:id},
                success: function (e) {
                    state.loading=false;
                    if(!e.result){
                        state.err={msg:e.msg};
                        this.setState(state);
                        return;
                    }

                    state.data=e.data;
                    this.setState(state);
                }.bind(this),
                error:function(err){
                    state.loading=false;
                    state.error={msg:err.message};
                    this.setState(state);
                }.bind(this)
            });
        },
        setNextOrderNum: function () {
           $.ajax({
              url:this.props.getNextOrderNumUrl,
               type:"get",
               dataType:"json",
               data:{parentId:state.data.ParentID||0},
                success: function (e) {
                    if(e.result) {
                        var state = this.state;
                        state.data.OrderNum=e.data;
                        this.setState(state);
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

            $.getJSON(this.props.getTopMenusUrl,null, function (e) {
                if(e.result){
                    var state=this.state;
                    state.topMenus=e.data;
                    state.topMenus.splice(0,0,{ID:0,MenuTitle:"顶级菜单"});
                    this.setState(state);
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
                return(React.createElement("span", null, "loading..."));
            }

            if(state.error){
                return(React.createElement("span", null, "error:", state.error.msg));
            }

            if(state.hide){
                return (React.createElement("span", null));
            }

            var mainStyle={marginTop:"10px",marginBottom:"20px;"}
            var rowStyle={display:"flex",justifyContent: "flex-end",alignItems:"center",marginTop:"10px"}
            var marginTop10Style={marginTop:"10px"};
            var buttonDivStyle={display:"flex",justifyContent: "center",alignItems:"center",marginTop:"10px"};
            var aStyle={textDecoration: "underline",color:"rgb(0,132,228)"};
            var data=state.data;

            var topMenus=this.state.topMenus.map(function (menu,index) {
               return(React.createElement("option", {value: menu.ID}, menu.MenuTitle));
            });

            return (React.createElement("div", {style: mainStyle}, 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "名称"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("input", {type: "text", className: "form-control", placeholder: "输入名称", valueLink: this.linkState('data.MenuTitle')})
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "Key"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("input", {type: "text", className: "form-control", placeholder: "输入Key", valueLink: this.linkState('data.MenuKey')})
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "图标"))
                    ), 
                    React.createElement("div", {className: "col-lg-9"}, 
                        React.createElement("input", {type: "text", className: "form-control", placeholder: "输入Glyphicons样式", valueLink: this.linkState('data.MenuIcon')})
                    ), 
                    React.createElement("div", {className: "col-lg-2"}, 
                        React.createElement("a", {href: "http://v3.bootcss.com/components", target: "_blank", style: aStyle}, "查看Glyphicons样式")
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "父菜单"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("select", {className: "form-control", valueLink: this.linkState("data.ParentID")}, 
                            topMenus
                        )
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "Code"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("input", {type: "text", className: "form-control", placeholder: "输入Code", value: this.linkState('data.MenuCode')})
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "备注"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("textarea", {type: "text", className: "form-control", placeholder: "输入备注", value: this.linkState('data.MenuRemark')})
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "排序号"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("div", {className: "input-group"}, 
                            React.createElement("input", {type: "text", className: "form-control", placeholder: "输入排序号", value: this.linkState('data.OrderNum')}), 
                            React.createElement("div", {className: "input-group-btn"}, React.createElement("button", {type: "=button", className: "btn btn-default"}, "设为最大值"))
                        )
                    )
                ), 
                React.createElement("div", {className: "row", style: rowStyle}, 
                    React.createElement("div", {className: "col-lg-1", style: "text-align:right"}, 
                        React.createElement("span", null, React.createElement("strong", null, "状态"))
                    ), 
                    React.createElement("div", {className: "col-lg-11"}, 
                        React.createElement("label", null, React.createElement("input", {type: "checkbox", checkedLink: this.linkState('data.IsValid')}), React.createElement("strong", null, "启用"))
                    )
                ), 
                React.createElement("div", {className: "row", style: buttonDivStyle}, 
                    React.createElement("div", {className: "col-lg-1"}, 
                        React.createElement("button", {type: "button", className: "btn btn-info", onClick: this.save.bind(this), disabled: !!this.state.data.IsDeleted}, "保存")
                    ), 
                    React.createElement("div", {className: "col-lg-1"}), 
                    React.createElement("div", {className: "col-lg-1"}, 
                        React.createElement("button", {type: "button", className: "btn btn-danger", onClick: this.remove.bind(this), disabled: !!this.state.data.ID}, "删除")
                    )
                )
            ));
        }
    });

    return EditPanel;
});