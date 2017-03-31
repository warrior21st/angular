/**
 * Created by warriorHuang on 2016/4/19.
 */
define(['react'], function (React) {

    var PagingToolBar=React.createClass({displayName: "PagingToolBar",
       getInitialState: function () {
           return {pageIndex:1};
       },
        _handleClick: function (pageIndex) {
            this.setState({pageIndex:pageIndex});
            this.props.handlePageChange(pageIndex);
        },
        render: function () {
            var pageSize=this.props.pageSize;
            var total=this.props.total;
            var pageIndex=this.state.pageIndex;
            var pageCount=Math.ceil(total/pageSize);
            var items=[];
            var activedStyle={color:"rgb(0,132,228)",cursor:"default"};
            var boxStyle={display:"flex",justifyContent:"flex-end"};

            for(var i=0;i<pageCount;i++){
                items.push(pageIndex==i+1?
                    (React.createElement("button", {type: "button", className: "btn btn-default", style: activedStyle}, i+1))
                    :(React.createElement("button", {type: "button", className: "btn btn-default", onClick: this._handleClick.bind(this,i+1)}, i+1))
                );
            }

            return(React.createElement("div", {style: boxStyle}, React.createElement("div", {className: "btn-group"}, items)));
        }
    });

    return PagingToolBar;
});