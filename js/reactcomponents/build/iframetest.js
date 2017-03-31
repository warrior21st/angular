/**
 * Created by warriorHuang on 2016/4/9.
 */
define(['react'],function(React){

    var IframeTest=React.createClass({displayName: "IframeTest",
       render: function () {
           var iframeStyle={width:"100%",height:"100%",border:"none"};
           return(React.createElement("iframe", {src: "http://dotamax.com", style: iframeStyle, scrolling: "auto"}));
       }
    });

    return IframeTest;
});