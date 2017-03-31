/**
 * Created by tu on 2016/3/30.
 */
define([], function () {

    var _types=[
        {
            type:"text",
            domType:"text"
        },
        {
           type:"password",
           domType:"password"
        },
        {
            type:"number",
            domType:"number"
        },
        {
            type:"int",
            domType:"number",
            pattern:/^-?[1-9]d*$/,
            errorMsg:"请输入整数"
        },
        {
            type:"float",
            domType:"number",
            pattern:"^-?([1-9]d*.d*|0.d*[1-9]d*|0?.0+|0)$",
            errorMsg:"请输入小数"
        },
        {
            type:"mobile",
            domType:"text",
            pattern:/^[1][358][0-9]{9}$/,
            errorMsg:"请输入手机号码"
        },
        {
            type:"english",
            domType:"text",
            pattern:/^[A-Za-z]+$/,
            errorMsg:"请输入英文"
        },
        {
            type:"englishOrNumber",
            domType:"text",
            pattern:/^[A-Za-z0-9]+$/,
            errorMsg:"请输入英文或数字"
        },
        {
            type:"chinese",
            domType:"text",
            pattern:/^[u4e00-u9fa5],{0,}$/,
            errorMsg:"请输入中文"
        },
        {
            type:"email",
            domType:"text",
            pattern:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            errorMsg:"邮箱格式不正确"
        },
        {
            type:"idcard",
            domType:"text",
            pattern:/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
            errorMsg:"请输入正确的身份证号"
        }
    ];

    var _typesIndex={

    };

    for(var j=0,jl=_types.length;j<jl;j++){
        _typesIndex[_types[j].type]=j;
    }

    function Vtypes() {

    };

    Vtypes.prototype._types=_types;
    Vtypes.prototype._typesIndex=_typesIndex;
    Vtypes.prototype.getType= function (type) {
        var index=Vtypes.prototype._typesIndex[type];
        if(!index&&index!=0){
            throw "type is not exist";
            return null;
        }

        return Vtypes.prototype._types[index];
    };

    Vtypes.prototype.extend= function (arr) {
        for(var i=0,l=arr.length;i<l;i++){
            if(!arr[i].type){
                throw "type is undefined";
                return;
            }

            if(Vtypes.prototype._typesIndex[arr[i].type]){
                throw "type already exist";
                return;
            }

            if(!arr[i].domType){
                arr[i].domType="text";
            }
            Vtypes.prototype._types.push(arr[i]);
            Vtypes.prototype._typesIndex[arr[i].type]=Vtypes.prototype._types.length-1;
        }
    };

    return Vtypes;
});