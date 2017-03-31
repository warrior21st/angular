/**
 * Created by tu on 2016/3/14.
 */
define(['react','rootstore'], function (React,rootstore) {

    var createTabs=function() {
        var tabsStyle = {
            tabStyle: {
                display: '-webkit-flex',
                flexDirection: 'row-reverse',
                alignItems: 'center'
            },
            closeBtnStyle: {cursor: 'pointer'},
            titleStyle: {
                display: '-webkit-flex',
                flexDirection: 'row',
                alignItems: 'center'
            },
            separatedStyle: {width: '10px'}
        };

        var Tabs = React.createClass({displayName: "Tabs",
            getInitialState: function () {
                return {
                    items: [],
                    hoverIndex: -1,
                    activeIndex: 0,
                    //closing: false
                };
            },
            componentDidMount: function () {
                rootstore.addChangeListener(this._addTab);
                //EventEmitter.subscribe('addtab', function (tabData) {
                //    this.addTab(tabData);
                //}.bind(this));
            },
        componentWillUnmount: function() {
            rootstore.removeChangeListener(this._addTab);
        },
            _addTab: function () {
                var tabData = rootstore.getAll();
                var tabs = this.state.items;
                var state = this.state;
                var existindex=-1;
                for(var i=0;i<tabs.length;i++){
                    if(tabs[i].ID==tabData.ID){
                        existindex=i;
                        break;
                    }
                }

                if(existindex==-1) {
                    tabs.push(tabData);
                    state.items = tabs;
                    this.setState(state);
                    existindex=tabs.length-1;
                }

                this.activeTab(existindex);
            },
            activeTab: function (index) {
                var state = this.state;
                var tabs = state.items;
                state.hoverIndex = index;
                //if (!state.closing) {
                    state.activeIndex = index;
                    //state.closing=false;
                    window.location.hash="#/"+state.items[index].MenuKey;
                //}
                this.setState(state);
            },
            //_active: function (index) {
            //    var state=this.state;
            //    state.activeIndex = index;
            //    window.location.hash="#/"+state.items[index].MenuKey;
            //},
            removeTab: function (index,e) {
                var e=e||window.event;
                e.stopPropagation();
                e.preventDefault();

                var state = this.state;
                var tabs = state.items;
                tabs.splice(index, 1);
                if (index != state.activeIndex) {
                    if (state.activeIndex > index) {
                        this.activeTab(state.activeIndex - 1);
                    }
                    else
                    {
                        this.activeTab(state.activeIndex);
                    }
                }
                else {
                    if (tabs.length == index&&tabs.length>0) {
                        this.activeTab(state.activeIndex - 1);
                    }
                    else if(tabs.length==0)
                    {
                        window.location.hash="#/index";
                        state.activeIndex=0;
                    }
                    else{
                        this.activeTab(state.activeIndex);
                    }
                }

                state.items = tabs;
                //state.closing = true;
                this.setState(state);
                console.log({activeIndex: this.state.activeIndex, item: this.state.items[this.state.activeIndex]});
            },
            handleMouseOver: function (index) {
                var state = this.state;
                state.hoverIndex = index;
                this.setState(state);
            },
            handleMouseOut: function (index) {
                var state = this.state;
                state.hoverIndex = -1;
                this.setState(state);
            },
            render: function () {
                if(this.state.items.length==0){
                    return (React.createElement("div", null));
                }

                var arr = this.state.items;
                var items = [];
                for (var i = 0; i < arr.length; i++) {
                    var tab = arr[i];
                    items.push(
                        React.createElement("li", {className: this.state.activeIndex==i?"active":"", onClick: this.activeTab.bind(this,i), 
                            onMouseOver: this.handleMouseOver.bind(this,i), 
                            onMouseOut: this.handleMouseOut.bind(this,i)}, 
                            React.createElement("a", {href: "javascript:void(0);", style: tabsStyle.tabStyle}, 
                                React.createElement("span", {
                                    className: this.state.activeIndex==i||this.state.hoverIndex==i?"glyphicon glyphicon-remove":"", 
                                    style: tabsStyle.closeBtnStyle, onClickCapture: this.removeTab.bind(this,i)}), 
                                React.createElement("div", {style: tabsStyle.separatedStyle}), 
                                React.createElement("div", {style: tabsStyle.titleStyle}, tab.MenuTitle)
                            )
                        )
                    );
                }

                return (React.createElement("ul", {className: "nav nav-tabs"}, items));
            }
        });

        return Tabs;
    };

    var data={createTabs:createTabs};

    return data;
});