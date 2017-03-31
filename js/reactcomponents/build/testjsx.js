var Menus= React.createClass({displayName: "Menus",
    handleClick:function(id,title){
        var obj=new EventEmitter();
        obj.dispatch('addtab',{id:id,title:title});
    },
    render:function(){
        var list = this.props.list;

        var items=[];
        for(var i=0;i<list.length;i++){
            var module=list[i];
            items.push(React.createElement("div", {className: "leftMnTab_title", "data-toggle": "collapse", "data-parent": "#leftmenus", "data-target": "#child"+module.ID, _id: module.ID}, module.title));
            var itemschild=[];
            for(var j=0;j<module.childs.length;j++){
                var func=module.childs[j];
                itemschild.push(React.createElement("li", {className: "leftMnTab_lt_liebiao", _id: "function"+func.ID, _title: func.title, _key: func.key, "ui-sref": func.key, onClick: this.handleClick.bind(this,func.ID,func.title)}, React.createElement("span", null, func.title)));
            }
            items.push(React.createElement("ul", {id: "child"+module.ID, className: "collapse leftMnTab_lt"}, itemschild));
        }

        return(React.createElement("div", {id: "leftmenudiv", className: "col-xs-12 panel leftMnTab"}, items));
    }
});


var data=[{"ID":1,"title":"模块Module-1","leaf":false,"childs":[{"ID":11,"title":"功能Function-11","leaf":true,"key":"key11"},{"ID":12,"title":"功能Function-12","leaf":true,"key":"key12"},{"ID":13,"title":"功能Function-13","leaf":true,"key":"key13"},{"ID":14,"title":"功能Function-14","leaf":true,"key":"key14"},{"ID":15,"title":"功能Function-15","leaf":true,"key":"key15"}]},{"ID":2,"title":"模块Module-2","leaf":false,"childs":[{"ID":21,"title":"功能Function-21","leaf":true,"key":"key21"},{"ID":22,"title":"功能Function-22","leaf":true,"key":"key22"},{"ID":23,"title":"功能Function-23","leaf":true,"key":"key23"},{"ID":24,"title":"功能Function-24","leaf":true,"key":"key24"},{"ID":25,"title":"功能Function-25","leaf":true,"key":"key25"}]},{"ID":3,"title":"模块Module-3","leaf":false,"childs":[{"ID":31,"title":"功能Function-31","leaf":true,"key":"key31"},{"ID":32,"title":"功能Function-32","leaf":true,"key":"key32"},{"ID":33,"title":"功能Function-33","leaf":true,"key":"key33"},{"ID":34,"title":"功能Function-34","leaf":true,"key":"key34"},{"ID":35,"title":"功能Function-35","leaf":true,"key":"key35"}]},{"ID":4,"title":"模块Module-4","leaf":false,"childs":[{"ID":41,"title":"功能Function-41","leaf":true,"key":"key41"},{"ID":42,"title":"功能Function-42","leaf":true,"key":"key42"},{"ID":43,"title":"功能Function-43","leaf":true,"key":"key43"},{"ID":44,"title":"功能Function-44","leaf":true,"key":"key44"},{"ID":45,"title":"功能Function-45","leaf":true,"key":"key45"}]},{"ID":5,"title":"模块Module-5","leaf":false,"childs":[{"ID":51,"title":"功能Function-51","leaf":true,"key":"key51"},{"ID":52,"title":"功能Function-52","leaf":true,"key":"key52"},{"ID":53,"title":"功能Function-53","leaf":true,"key":"key53"},{"ID":54,"title":"功能Function-54","leaf":true,"key":"key54"},{"ID":55,"title":"功能Function-55","leaf":true,"key":"key55"}]}]

ReactDOM.render(
    React.createElement(Menus, {list: data}),
    document.getElementById('container')
);