/**
 * Created by tu on 2016/4/15.
 */
define(['react','./pagingtoolbar','./dialog','jquery'], function (React,PagingToolBar,dialog,$) {
    var Image=React.createClass({
        _handleClick: function () {
            window.open(this.props.src);
        },
       render: function () {
           var boxStyle={display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"500px"};
           var imgStyle={maxWidth:"100%",maxHeight:"100%",cursor:"pointer"};
        return(<div style={boxStyle}><img src={this.props.src} style={imgStyle} title="点击查看原图" onClick={this._handleClick.bind(this)}/></div>);
       }
    });

    var ImageList=React.createClass({
        getInitialState: function () {
            return {};
        },
        componentDidMount: function () {

        },
        componentWillReceiveProps: function (nextProps) {
          this.forceUpdate();
        },
        _handleClick: function (file) {
            dialog.openDialog({
                templateComponent:Image,
                templateComponentParams:{src:file.FileFullUri},
                title:file.FileName,
                width:800,
                height:600
            });
        },
        render: function () {
            var list=this.props.list;
            var width=this.props.width||800;
            var height=this.props.height||600;
            var boxStyle={width:width+"px",height:height+"px",overflowY: "auto"};
            var aStyle={width:"242px",height:"200px",display:"flex",alignItems:"center"};
            var imgStyle={maxWidth:"100%",maxHeight:"100%"};
            var offsetW=document.body.offsetWidth-230;
            var rowSize=(offsetW-offsetW%242)/242;
            rowSize-=1;
            var divClassName="col-xs-"+Math.floor(12/rowSize);
            var items=[];
            for(var i=0,l=list.length;i<l;i=i+rowSize){
                var itemsChild=[];
                for(var j=i;j<i+rowSize;j++){
                    if(j==l){
                        break;
                    }
                    itemsChild.push(<div className={divClassName} title={list[j].FileName||""}>
                        <a href="javascript:void(0);" className="thumbnail" onClick={this._handleClick.bind(this,list[j])} style={aStyle}>
                            <img src={(this.props.imageCompressionUri ||"")+list[j].FileFullUri} alt="" style={imgStyle} />
                        </a>
                    </div>);
                }
                items.push(<div className="row">{itemsChild}</div>)
            }

            return(<div>{items}</div>);
        }
    });

    var ImageMange=React.createClass({
       getInitialState: function () {
         return {loading:true,error:null,data:null,currentPageIndex:1};
       },
        handlePageChange: function (pageIndex) {
            this.setState({currentPageIndex:pageIndex});
        },
        componentDidMount: function () {
            this.setState({loading:true});
            $.getJSON(this.props.getImageListUri,null, function (e) {
                var state=this.state;
                state.loading=false;
                if(!e.result){
                    state.error=e.msg;
                    return;
                }

                state.error=null;
                state.data=e.data;
                this.setState(state);
            }.bind(this));
        },
        render: function () {
            if(this.state.loading){
                return(<span>loading...</span>);
            }
            else if(this.state.error){
                return(<span>{this.state.error}</span>);
            }

            var offsetW=document.body.offsetWidth-230;
            var rowSize=(offsetW-offsetW%242)/242;
            rowSize-=1;

            var rowCount=3;
            var pageSize=rowCount*rowSize;

            var data=[];
            var start=(this.state.currentPageIndex-1)*pageSize;
            for(var i=start;i<start+pageSize;i++){
                if(i==this.state.data.length){
                    break;
                }

                data.push(this.state.data[i]);
            }


            return (<div>
                <ImageList list={data}></ImageList>
                <PagingToolBar pageSize={pageSize} total={this.state.data.length} handlePageChange={this.handlePageChange.bind(this)}></PagingToolBar>
            </div>);
        }
    });

    return ImageMange;
});