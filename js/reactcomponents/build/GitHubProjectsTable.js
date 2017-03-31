/**
 * Created by tu on 2016/3/14.
 */
define(['react','jquery'],function(React,$){
   var createTable=function(){

       var height10Style={height:"10px"};

       var rightStyle={textAlign:"right"};

       var Table=React.createClass({displayName: "Table",
           getInitialState: function () {
               return { loading: true, error: null, data: null,query:"javascript"};
           },
           componentDidMount:function() {
               this.request();
           },
           request: function () {
               var state=this.state;
               state.loading=true;
               $.ajax({
                   url:"https://api.github.com/search/repositories",
                   type:"get",
                   dataType:"json",
                   data:{q:this.state.query,sort:'stars'},
                   success: function (e) {
                       var state=this.state;
                       state.loading=false;
                       state.data= e;
                       this.setState(state);
                   }.bind(this),
                   error: function (err) {
                       var state=this.state;
                       state.loading=false;
                       state.error=err;
                       this.setState(state);
                   }.bind(this)
               });
           },
           handleSearch:function(){
               var q=this.refs.searchInput.getDOMNode().value;
               var state=this.state;
               state.query=q;
               this.setState(state);
               this.request();
           },
           render:function(){
               var getdiv=function(dom){
                   return(React.createElement("div", null, React.createElement("div", {className: "row"}, 
                       React.createElement("div", {className: "col-xs-5"}, 
                       React.createElement("div", {className: "input-group"}, 
                       React.createElement("input", {ref: "searchInput", type: "text", className: "form-control", placeholder: "输入字符搜索", value: "javascript"}), 
                       React.createElement("span", {className: "input-group-btn"}, React.createElement("button", {className: "btn btn-default", type: "button", onClick: this.handleSearch.bind(this)}, "搜索"))
                   )
                   ), 
                   React.createElement("div", {className: "col-xs-7", style: rightStyle}, React.createElement("span", null, "projects:", this.state.data?"30 of "+this.state.data.total_count:0))
                   ), 
                   React.createElement("div", {style: height10Style}), 
                       React.createElement("div", {class: "row"}, 
                       React.createElement("div", {class: "col-xs-12"}, dom)
                       )));
               }.bind(this);

               if(this.state.loading){
                   return (getdiv(React.createElement("span", null, "Loading...")));
               }
               else if (this.state.error !== null) {
                   return (getdiv(React.createElement("span", null, "Error: ", this.state.error.message)));
               }
               else{
                   var repos = this.state.data.items;
                   var items=[];
                   for(var i=0;i<repos.length;i++){
                       items.push(React.createElement("tr", null, React.createElement("td", null, i+1), React.createElement("td", null, repos[i].name), React.createElement("td", null, repos[i].language), React.createElement("td", null, React.createElement("a", {href: repos[i].git_url, title: repos[i].git_url}, repos[i].git_url.length>40?repos[i].git_url.substr(0,40)+"...":repos[i].git_url)), React.createElement("td", null, repos[i].stargazers_count), React.createElement("td", null, repos[i].updated_at.replace("T"," ").replace("Z",""))));
                   }

                   var table= (React.createElement("table", {className: "table table-striped table-bordered table-hover"}, 
                       React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "name"), React.createElement("th", null, "language"), React.createElement("th", null, "gitUrl"), React.createElement("th", null, "stars"), React.createElement("th", null, "UpdatedAt"))), 
                       React.createElement("tbody", null, items)
                   ));

                   return(getdiv(table));
               }
           }
       });

       return Table;
   };

    var data={createTable:createTable};

    return data;
});
