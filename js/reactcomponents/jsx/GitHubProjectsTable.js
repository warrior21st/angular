/**
 * Created by tu on 2016/3/14.
 */
define(['react','jquery'],function(React,$){
   var createTable=function(){

       var height10Style={height:"10px"};

       var rightStyle={textAlign:"right"};

       var Table=React.createClass({
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
                   return(<div><div className="row">
                       <div className="col-xs-5">
                       <div className="input-group">
                       <input ref="searchInput" type="text" className="form-control" placeholder="输入字符搜索" value="javascript" />
                       <span className="input-group-btn"><button className="btn btn-default" type="button" onClick={this.handleSearch.bind(this)}>搜索</button></span>
                   </div>
                   </div>
                   <div className="col-xs-7" style={rightStyle}><span>projects:{this.state.data?"30 of "+this.state.data.total_count:0}</span></div>
                   </div>
                   <div style={height10Style}></div>
                       <div class="row">
                       <div class="col-xs-12">{dom}</div>
                       </div></div>);
               }.bind(this);

               if(this.state.loading){
                   return (getdiv(<span>Loading...</span>));
               }
               else if (this.state.error !== null) {
                   return (getdiv(<span>Error: {this.state.error.message}</span>));
               }
               else{
                   var repos = this.state.data.items;
                   var items=[];
                   for(var i=0;i<repos.length;i++){
                       items.push(<tr><td>{i+1}</td><td>{repos[i].name}</td><td>{repos[i].language}</td><td><a href={repos[i].git_url} title={repos[i].git_url}>{repos[i].git_url.length>40?repos[i].git_url.substr(0,40)+"...":repos[i].git_url}</a></td><td>{repos[i].stargazers_count}</td><td>{repos[i].updated_at.replace("T"," ").replace("Z","")}</td></tr>);
                   }

                   var table= (<table className="table table-striped table-bordered table-hover">
                       <thead><tr><th>#</th><th>name</th><th>language</th><th>gitUrl</th><th>stars</th><th>UpdatedAt</th></tr></thead>
                       <tbody>{items}</tbody>
                   </table>);

                   return(getdiv(table));
               }
           }
       });

       return Table;
   };

    var data={createTable:createTable};

    return data;
});
