/**
 * Created by warriorHuang on 2016/4/7.
 */
define(['react','reactdom','jquery'], function (React,ReactDOM,$) {
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

    var DialogComponent=React.createClass({
       getInitialState: function () {
            return {id:""};
       },
        componentDidMount: function () {

            if(typeof this.props.templateComponent=="string"){
                require([this.props.templateComponent], function (component) {
                   ReactDOM.render(
                       React.createElement(component,this.props.templateComponentParams),
                       this.refs.panelBody.getDOMNode()
                   );

                }.bind(this));
            }
            else if(typeof this.props.templateComponent==="function"){
                ReactDOM.render(
                    React.createElement(this.props.templateComponent,this.props.templateComponentParams),
                    this.refs.panelBody.getDOMNode()
                );
            }
        },
        _onOK: function (obj) {
                this.props.onOK(obj);
            //this.setState({close: true});
        },
        _onCancel: function (obj) {

                this.props.onCancel(obj);
        },
        render: function () {

            var width=this.props.width||640;
            var height=this.props.height||480;
            var hideStyle={display:"none"};
            var showStyle={display:"block"};

            var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;//浏览器窗口宽度
            var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;//浏览器窗口高度
            var aw = document.body.scrollWidth;//网页正文宽度
            var ah = document.body.scrollHeight;//网页正文高度
            var wbox_w = width;//弹出框宽度
            var wbox_h = height;//弹出框高度
            var bg_w = w;
            var bg_h = h;
            var left = (w - wbox_w) / 2;
            var top = (h - wbox_h) / 2;
            if (ah > h) {
                bg_w = aw;
                bg_h = ah;
            }

            var title=this.props.title||"";

            var boxStyle={
                position:"fixed",
                top:parseInt(top)+"px",
                left:parseInt(left)+"px",
                display:"block",
                zIndex:8001,
                width:width+"px",
                height:height+"px"
            }
            var maskStyle={
                display:this.props.showMask===false?"none":"block",
                width:bg_w + "px",
                height:bg_h + "px",
                position:"fixed",
                top:"0px",
                left:"0px",
                backgroundColor:"black",
                opacity:0.2,
                zIndex:8000
            };

            var titleStyle={width:"98%"};
            var cancelBtnStyle={cursor:"pointer"};
            var tableStyle={width:"100%"};

            return(
                <div>
                    <div style={maskStyle}></div>
                    <div className="panel panel-default" style={boxStyle}>
                        <div className="panel-heading">
                            <table style={tableStyle}>
                                <tr>
                                    <td style={titleStyle}>{title}</td>
                                    <td><span className="glyphicon glyphicon-remove" style={cancelBtnStyle} onClick={this._onCancel.bind(this)}></span></td>
                                </tr>
                            </table>
                        </div>
                        <div className="panel-body" ref="panelBody">
                        </div>
                    </div>
                </div>
            );
        }
    });

    var id="dialog_"+randomString(26);

    var dialog={
        openDialog: function (params) {
            if(!params||(!params.templateComponent)){
                throw "dialog 缺少必要参数:templateComponent";
                return;
            }

            if(!document.getElementById(id)){
                var dom=document.createElement('div');
                dom.id=id;
                dom.style.display="block";
                dom.style.width="1px";
                dom.style.height="1px";
                document.body.appendChild(dom);
            }

            para={
                width:params.width||640,
                height:params.height||480,
                title:params.title||"",
                templateComponent:params.templateComponent,
                templateComponentParams:params.templateComponentParams||null,
                onOK:function(obj){
                    if(typeof  params.onOK==="function"){
                        params.onOK(obj);
                    }

                    console.log("dialog ok");
                    document.body.removeChild(document.getElementById(id));
                },
                onCancel:function(obj){
                   if(typeof  params.onCancel==="function"){
                       params.onCancel(obj);
                   }
                    console.log("dialog cancel");
                    document.body.removeChild(document.getElementById(id));
                }
            };

            ReactDOM.render(
                React.createElement(DialogComponent,para),
                document.getElementById(id)
            );
        }
    };

    return dialog;
});