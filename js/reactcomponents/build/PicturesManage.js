/**
 * Created by warriorHuang on 2016/4/11.
 */
define(['react','jquery','./dialog'], function (React,$,dialog) {

    var width=1024;
    var height=768;
    var width98Style={width:"98%"};
    var BigImg=React.createClass({displayName: "BigImg",
       render: function () {

           var cancelBtnStyle={cursor:"pointer"};
        return(React.createElement("div", {className: "panel panel-default", style: ""}, 
            React.createElement("div", {className: "panel-body"}, 
                React.createElement("table", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", {style: width98Style}), 
                        React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-remove", style: cancelBtnStyle, onClick: this._onCancel.bind(this)}))
                    ), 
                    React.createElement("tr", null, 
                        React.createElement("td", {colspan: "2"})
                    )
                )
            )
        ));
       }
    });
});