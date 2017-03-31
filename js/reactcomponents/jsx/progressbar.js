/**
 * Created by tu on 2016/4/1.
 */
define(['react'], function (React) {

    var ProgressBar=React.createClass({
       getInitialState: function () {
           return {percent:0,boxTop:0};
       },
        componentWillReceiveProps: function () {
          this.setState({percent:this.props.percent});
        },
        componentDidMount: function () {

        },
        render: function () {
            var hide=this.state.percent==0||this.state.percent==100?true:false;
            var width=this.props.width||400;
            var height=this.props.height||30;

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
            var boxStyle={
                position:"fixed",
                top:parseInt(top)+"px",
                left:parseInt(left)+"px",
                display:"block",
                zIndex:9998,
                width:width+"px",
                height:height+"px"
            }
            var maskStyle={
                display:"block",
                width:bg_w + "px",
                height:bg_h + "px",
                position:"fixed",
                top:"0px",
                left:"0px",
                backgroundColor:"black",
                opacity:0.2,
                zIndex:9997
            };

            var proStyle={width:this.state.percent+"%",display:"flex",alignItems:"center",justifyContent:"center",height:"100%",zIndex:"9999"};
            var textStyle={
                position: "relative",
                width:"100%",
                height:"100%",
                top:(height*-1)+"px",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"black",
                lineHeight:height+"px",
                fontFamily:"微软雅黑",
                zIndex:"10000"
            };


            var text="";
            if(this.state.percent==100){
                text="100%";
            }
            else if(this.state.percent<100){
                text="正在上传"+this.state.percent+"%";
            }

            return(<div style={hide?hideStyle:showStyle}>
            <div style={maskStyle}></div>
                <div className="progress" style={boxStyle}>
                    <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={this.state.percent} aria-valuemin="0" aria-valuemax="100" style={proStyle}>
                    </div>
                    <div style ={textStyle}>
                        {text}
                    </div>
                </div>
                </div>);
        }
    });

    return ProgressBar;
});