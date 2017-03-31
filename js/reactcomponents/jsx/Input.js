/**
 * Created by warriorHuang on 2016/3/28.
 */
define(['react','jquery','./InputDataTypes'],function(React,$,Vtypes){
    var vt=new Vtypes();
    vt.extend([{
        type:"datetimepicker",
        domType:"text"
        },
        {
            type:"englishOrSymbol",
            domType:"text",
            pattern:/^\w+$/,
            errorMsg:"请输入英文、数字或下划线"
        },
        {
            type:"textarea",
            domType:"textarea"
        }]);

    var InputBox=React.createClass({
        getInitialState: function () {
            return {
                valid:true,
                changed:false,
                value:this.props.defaultValue||""
            };
        },
        getValid: function () {
          return this.state.valid;
        },
        setValue: function (v) {
            var state=this.state;
            state.value=v;
            this.setState(state);
            this._handleChange();
        },
        updateStatus: function () {
          this._handleChange();
        },
        init: function () {
          this.setState(this.getInitialState());
        },
        _handleChange: function () {

            var state=this.state;
            state.value=this.refs[this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")].getDOMNode().value;
            //this.setState(state);
            state.changed=true;
            state.valid=true;
            var v=state.value;
            //state.value=""

            var typeobj=vt.getType(this.props.type);
            if(typeobj.pattern&&!typeobj.pattern.test(v)&&v.length>0){
                state.valid=false;
            }

            if(this.props.maxLength&&v.length>parseInt(this.props.maxLength)){
                state.valid=false;
            }
            if(this.props.minLength&&v.length<parseInt(this.props.minLength)){
                state.valid=false;
            }
            if(this.props.required=="true"&&state.value.length==0){
                state.valid=false;
            }

            this.setState(state);
            if(state.valid){
                this.props.modelHandler.handler(this.props.modelHandler.model,state.value);
            }
        },
        //componentWillReceiveProps: function (newProps) {
        //    this.setState(this.getInitialState());
        //},
        componentDidMount: function () {
          if(this.props.type=="datetimepicker"){
              require(["datetimepicker"], function () {
                  $('#'+this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")).datetimepicker();
              });
          }
        },
        render: function () {
            if(!this.props.type){
                throw "type undefined";
                return null;
            }

            if(!this.props.modelHandler){
                throw "modelHandler undefined";
                return null;
            }
            else if(!this.props.modelHandler.model){
                throw "modelHandler.model undefined";
                return null;
            }
            else if(!this.props.modelHandler.handler){
                throw "modelHandler.handler undefined";
                return null;
            }
            else if(typeof (this.props.modelHandler.handler)!="function"){
                throw "modelHandler.handler is not a function";
                return null;
            }

            var typeobj=vt.getType(this.props.type);
            if(!typeobj){
                throw "type is not exist";
                return null;
            }

            var type=typeobj.domType;
            var errMsg=typeobj.errorMsg||"";
            var styleValid=this.props.style||{};
            //styleValid.border="solid 1px rgb(0,128,0)";
            var styleInvalid=this.props.style||{};
            styleInvalid.border="solid 1px rgb(169,68,66)";

            if(this.state.changed){
                if(this.state.value.length==0&&!this.state.valid) {
                    errMsg="该项为必填项";
                }
                else if(!this.state.valid&&this.state.value.length>0){
                    if(this.props.type!="mobile"&&this.props.type!="idcard"){
                        if (this.props.maxLength && this.props.minLength) {
                            if (this.props.maxLength == this.props.minLength) {
                                errMsg += "(" + this.props.maxLength + "位)";
                            }
                            else {
                                errMsg += "(" + this.props.minLength + "位到" + this.props.maxLength + "位)";
                            }
                        }
                        else if (this.props.maxLength) {
                            errMsg += "(" + this.props.maxLength + "位以下" + ")";
                        }
                        else if (this.props.minLength) {
                            errMsg += "(" + this.props.minLength + "位以上" + ")";
                        }
                    }
                    else if(this.props.type=="mobile"){
                        errMsg+="(11位)"
                    }
                    else if(this.props.type!="idcard"){
                        errMsg+="(15位或18位)"
                    }
                }
            }

            var tooltipStyle={};
            if(this.state.valid) {
                tooltipStyle = {display: "none"};
            }
            //var left50Style={left: "50%"};
            var toolTip= (<span className="label label-danger" style={tooltipStyle}>{errMsg}</span>);

            if(typeobj.domType!="textarea") {
                if(!this.props.addon) {
                    return (<div><input id={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")} type={type}
                                        className={this.props.className||""}
                                        style={this.state.changed?(this.state.valid?styleValid:styleInvalid):(this.props.style||{})}
                                        placeholder={this.props.placeholder||""}
                                        value={this.state.value}
                                        ref={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")}
                                        onChange={this._handleChange.bind(this)}
                                        onBlur={this._handleChange.bind(this)}
                                    />
                                    {toolTip}
                            </div>);
                }
                else{
                    return (<div><div className="input-group">
                        {this.props.addon.location=="left"?this.props.addon.content:null}
                        <input id={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")} type={type}
                                        className={this.props.className||""}
                                        style={this.state.changed?(this.state.valid?styleValid:styleInvalid):(this.props.style||{})}
                                        placeholder={this.props.placeholder||""}
                                        value={this.state.value}
                                        ref={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")}
                                        onChange={this._handleChange.bind(this)}
                                        onBlur={this._handleChange.bind(this)}
                        />
                        {this.props.addon.location=="right"?this.props.addon.content:null}
                        </div>
                        {toolTip}
                            </div>);
                }
            }
            else{
                return(<div><textarea id={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")} type={type}
                                   className={this.props.className||""}
                                   style={this.state.changed?(this.state.valid?styleValid:styleInvalid):(this.props.style||{})}
                                   placeholder={this.props.placeholder||""}
                                   ref={this.props.modelHandler.model.replace(new RegExp('\\.','g'),"_")}
                                   value={this.state.value}
                                   onChange={this._handleChange.bind(this)}
                                   ></textarea>
                                    {toolTip}
                </div>);
            }
        }
    });

    return {InputBox:InputBox,Vtypes:vt};
});