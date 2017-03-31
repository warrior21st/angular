/**
 * Created by warriorHuang on 2016/4/9.
 */
define(['react'],function(React){

    var DialogContent=React.createClass({displayName: "DialogContent",
       render: function () {

           return(React.createElement("embed", {src: "http://player.youku.com/player.php/sid/XMTUxODI5MTEyNA==/v.swf", allowFullScreen: "true", quality: "high", width: "600", height: "400", align: "middle", allowScriptAccess: "always", type: "application/x-shockwave-flash"}));
       }
    });

    return DialogContent;
});