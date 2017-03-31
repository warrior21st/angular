/**
 * Created by tu on 2016/3/31.
 */
define(['react'], function (React) {

    var setObj = function (obj, pName, pValue, i) {
        if (!i) {
            i = 0;
        }
        var arr=pName.split('.');
        if(arr.length==1){
            obj[pName]=pValue;
            return;
        }

        if(i<arr.length-1){
            var node={};
            node= obj[arr[i]];
            setObj(node,pName,pValue,i+1);
        }
        else{
            obj[arr[i]]=pValue;
        }
    };

    var LinkedModelMixin={
        linkModel:function(proName,type){
            var state=this.state;
            return {
                value:this._getter(state,proName),
                requestChange: function (newVal) {
                    state.changed = true;
                    this._setter(state,proName,newVal);
                    this.setState(state);

                }.bind(this)
            };
        },
        _setter: function(obj,pName,pValue) {
            var arr=pName.split('.');
            if(arr.length==1){
                obj[pName]=pValue;
                return;
            }

            setObj(obj,pName,pValue);
        },
        _getter: function (obj,pName) {
            var arr=pName.split('.');
            for(var i=0,l=arr.length;i<l;i++){
                obj=obj[arr[i]];
            }

            return obj;
        },
        handleDataChange:function(proName,newVal) {
            var state = this.state;
            state.changed = true;
            this._setter(state,proName,newVal);
            this.setState(state);
        }

    };

    React.addons.LinkedModelMixin=LinkedModelMixin;
});