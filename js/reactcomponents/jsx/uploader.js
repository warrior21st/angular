/**
 * Created by tu on 2016/4/1.
 */
define(['react','./progressbar'], function (React,ProgressBar) {

    /*
    *url：后台处理地址
    *fileFormats:文件后缀名限制，默认为允许所有文件，多个用英文逗号隔开，不区分大小写
    * fileMaxSize：单个文件的最大长度，单位M，默认为4
    *imgPreviewDom：图片预览dom，该值为使用图片预览功能必须
    * autoUpload：是否自动上传，图片预览功能仅支持非自动上传模式
    * multiple：是否支持多选,图片预览功能仅支持非多选模式
    *onComplete：完成事件触发，会带一个参数-服务器响应的text
    * onSuccess：成功事件触发，会带一个参数-服务器响应的text
    * onFiled：失败事件触发，会带一个参数-服务器响应的text
    * onStart：已开始触发
    * beforeStart：即将开始触发
    * */
    var Uploader=React.createClass({
       getInitialState: function () {
            return {percent:0};
       },
        componentDidMount: function () {
            //setInterval(function () {
            //    if(this.state.percent>=100){
            //        this.setState({percent:0});
            //        return;
            //    }
            //
            //    this.setState({percent:this.state.percent+1});
            //}.bind(this),100);
        },
        _updateProgress: function (loaded, total) {
            //var eleProgress = _this.find('#' + file.index + 'file .progress');
            var percent = loaded;

            if(total){
               percent= (loaded / total * 100).toFixed(2);
            }

            this.setState({percent:percent});
        },
        _clearFiles: function () {
          var input=this.refs.fileinput.getDOMNode();
            if (input.outerHTML) {
                input.outerHTML = input.outerHTML;
            } else { // FF(包括3.5)
                input.value = "";
            }
        },
        _onchange: function () {
            var files=this.refs.fileinput.getDOMNode().files;
            var arr=[];
            var fileFormats=this.props.fileFormats?this.props.fileFormats.toLowerCase():"*";
            var fileMaxSize=this.props.fileMaxSize?this.props.fileMaxSize:4;
            for (var i=0;i<files.length;i++) {
                var file = files[i];
                var arr = file.name.split('.');
                if(fileFormats!="*") {
                    if (fileFormats.indexOf(arr[arr.length - 1].toLowerCase()) == -1)
                    {
                        alert("包含格式不正确的文件");
                        return;
                    }
                }
                if(fileMaxSize>0) {
                    if (file.size > fileMaxSize* 1024 * 1024) {
                        alert("单个文件大小不能超过" + fileMaxSize + "M");
                        return;
                    }
                }
            }
            if(this.props.autoUpload===true){
                this.upload();
                return;
            }

            if(files.length==1&&!this.props.multiple){
                arr=files[0].name.split('.');
                if(["png","jpg","gif","jpeg","bmp"].indexOf(arr[arr.length-1].toLowerCase())!=-1&&this.props.imgPreviewDom) {
                    this._imgPreview(files[0]);
                }
            }

        },
        _imgPreview: function (file) {
            var pic=this.props.imgPreviewDom;
            var fileinput=this.refs.fileinput.getDOMNode();
            if(window.FileReader){//chrome,firefox7+,opera,IE10,IE9，IE9也可以用滤镜来实现
                oFReader = new FileReader();
                oFReader.readAsDataURL(file);
                oFReader.onload = function (oFREvent) {
                    pic.src = oFREvent.target.result;
                };
            }
            else if (document.all) {//IE8-
                fileinput.select();
                var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
                if (window.ie6) {
                    pic.src = reallocalpath;
                } //IE6浏览器设置img的src为本地路径可以直接显示图片
                else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
                    pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
                }
            }
            else if (fileinput.files.item) {//firefox6-
                if (fileinput.files.item(0)) {
                    var url =files.item(0).getAsDataURL();
                    pic.src = url;
                }
            }
        },
        _chooseFile: function () {
          this.refs.fileinput.getDOMNode().click();
        },
        upload: function (params) {
            var fileFormats=this.props.fileFormats?this.props.fileFormats.toLowerCase():"*";
            var fileMaxSize=this.props.fileMaxSize?this.props.fileMaxSize:4;

            var  files = this.refs.fileinput.getDOMNode().files;
            if(files.length==0){
                return;
            }

            for (var i=0;i<files.length;i++) {
                var file = files[i];
                var arr = file.name.split('.');
                if(fileFormats!="*") {
                    if (fileFormats.indexOf(arr[arr.length - 1].toLowerCase()) == -1)
                    {
                        alert("包含格式不正确的文件");
                        return;
                    }
                }
                if(fileMaxSize>0) {
                    if (file.size > fileMaxSize* 1024 * 1024) {
                        alert("单个文件大小不能超过" + fileMaxSize + "M");
                        return;
                    }
                }
            }

            (function (files) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    // 上传中
                    xhr.upload.addEventListener("progress", function (e) {
                        this._updateProgress(e.loaded,e.total);
                    }.bind(this), false);

                    // 文件上传成功或是失败
                    xhr.onreadystatechange = function (e) {
                        switch (xhr.readyState) {
                            case 4:
                                this._clearFiles();
                                if (xhr.status == 200) {
                                    if(typeof this.props.onComplete==="function") {
                                        this.props.onComplete(xhr.responseText);
                                    }
                                    if(typeof this.props.onSuccess==="function") {
                                        this.props.onSuccess(xhr.responseText);
                                    }
                                } else {
                                    if(typeof this.props.onComplete==="function") {
                                        this.props.onComplete(xhr.responseText);
                                    }
                                    if(typeof this.props.onFiled==="function") {
                                        this.props.onFalid(xhr.responseText);
                                    }
                                }
                                break;
                            case 1:
                                if(typeof this.props.onStart==="function") {
                                    this.props.onStart();
                                }
                                break;
                            case 0:
                                if(typeof this.props.beforeStart==="function") {
                                    this.props.beforeStart();
                                }
                                break;
                            default:
                                break;
                        }
                    };

                    var fd = new FormData();
                    for (var j = 0; j < files.length; j++) {
                        fd.append("file"+j.toString(), files[j]);
                    }
                    if(params&&typeof params==="object") {
                        for (var p in params) {
                            fd.append(p, params[p]);
                        }
                    }

                    // 开始上传
                    xhr.open("POST",this.props.url, true);
                    //xhr.setRequestHeader("Content-Type", "multipart/form-data;");
                    //xhr.overrideMimeType("application/octet-stream");
                    //xhr.setRequestHeader("filename", file.name);
                    xhr.send(fd);

                    //    xhr.send(file);
                }
            }).call(this,files);
        },
        render: function () {
            var boxStyle={display:"flex",justifyContent:"flex-start",alignItems:"center"};
            var showStyle={display:"block"};
            var hideStyle={display:"none"};
            return (<div style={boxStyle}><button type="button" className="btn btn-default" onClick={this._chooseFile.bind(this)}>选择文件</button>&nbsp;&nbsp;
                <button type="button" className="btn btn-default" style={this.props.showUploadBtn===false?hideStyle:showStyle} onClick={this.upload.bind(this)}>开始上传</button>
                {this.props.multiple?(<input type="file" ref="fileinput" name="fileinput_0.0.1" multiple="multiple" style={hideStyle} onChange={this._onchange.bind(this)} />):
            (<input type="file" ref="fileinput" name="fileinput_0.0.1" style={hideStyle} onChange={this._onchange.bind(this)} />)}
                <ProgressBar percent={this.state.percent}></ProgressBar></div>);
        }
    });

    return Uploader;
});