/**
 *插件名称 constructHighchart
 *插件功能 重新封装highchart，便于批量生成highchart
 *插件作者 C.H
 *插件制作时间 2014.04.14
 */
(function($){
    function RepackHighchart(){
        this.obj,
            this.objData,
            this.urlViewData,
            this.styleData,
            this.type,
            this._data,
            this.callback
    };
    RepackHighchart.prototype.event = function(){
        var o = this;
        var _viewdata = '';
        if(this.type){
            _viewdata = this._data;
        }else{
            $.ajax({
            type: "POST",
            async: false,
            url: o.urlViewData,
            dataType: "jsonp",
            data:o.objData,
            jsonp: "callback",
            jsonpCallback:"highchartsviewdata",
            success: function(data){
                _viewdata = data.data;

            },
            error: function(){
                //console.log('data error')
            }
        });
        }
        if(_viewdata !=''){
            var _chartdata="";


            if(_viewdata.chartType == 'pie'){
                _chartdata={
                    chart:{
                        type : 'pie',
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title:{text :''},
                    tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'}
                };
                _chartdata.chart.type = _viewdata.chartType;

                _chartdata.title.text = _viewdata.chartTitle;
                _chartdata.series = [{data:_viewdata.data}];
            }else{
                _chartdata={
                    chart:{
                        type : ''
                    },
                    title:{text :''},
                    xAxis:{categories:null,title:{text:''}},
                    yAxis:{title:{text:''}},
                    tooltip: {
                        valueSuffix: ''
                    }
                };
                _chartdata.chart.type = _viewdata.chartType;
                _chartdata.title.text = _viewdata.chartTitle;
                _chartdata.xAxis.categories = _viewdata.categories;
                _chartdata.xAxis.title.text = _viewdata.xAxisText;
                _chartdata.yAxis.title.text = _viewdata.yAxisText;
                _chartdata.tooltip.valueSuffix = _viewdata.valueSuffix;
                _chartdata.series =[];
                for(var i=0;i<_viewdata.data.length;i++){
                    _chartdata.series.push({type:_viewdata.dataType[i],name:_viewdata.dataName[i],data:_viewdata.data[i]});
                }
            }
            if(this.styleData !=''){
                this.extend(_chartdata,this.styleData);
            }
            if(_viewdata.chartType == 'pie'){
                _chartdata.chart.options3d = {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                };
                _chartdata.plotOptions = {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                };
            }else{
                _chartdata.chart.options3d ={
                    enabled: true,
                    alpha: 25,
                    beta: 3,
                    depth: 50,
                    viewDistance: 25
                };
                /*_chartdata.plotOptions = {                  // 点击事件
                    series: {
                        cursor: 'pointer',
                        events: {
                            click: function(e) {
                                alert(e.point.category);
                            }
                        }
                    }
                };*/
            }
            this.showChart(_chartdata);
        }
    };

    //判断空对象
    RepackHighchart.prototype.isEmptyObject = function(obj){
        for(var n in obj){return false}
        return true;
    }

    RepackHighchart.prototype.extend=function(o,n){
        if(!this.isEmptyObject(n)){

            for(var p in n){
                if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p))){
                    o[p]=n[p];
                }else{
                    for(var k in n[p]){
                        if(typeof(o[p][k]) == 'object'){    // 是对象
                            this.extend(o[p][k],n[p][k]);
                        }else if(typeof(o[p][k]) == 'string'){  //是字符串
                            if(n[p][k] == ''){  //判断前台变量是否为空，为空不替换

                            }else{
                                o[p]=n[p];    //如果后端数据与前代数据冲突，选择前端数据
                            }
                        }else if(typeof(o[p][k]) == 'undefined'){ //是空字符串
                            o[p][k]=n[p][k];
                        }
                    }
                }
            }
        }else{
        }
    };
    RepackHighchart.prototype.showChart = function(data){
        $(this.obj).highcharts(data);

    }

    $.fn.repackHighchart = function(options){
        defaults = {
            obj:this,
            data:'',            //向后台发送的JSON数据
            type:0,             //0表示请求url,1表示已经请求完成返回数据 _data
            _data:'',
            urlViewData:'',
            styleData:'',
            back:function(data){}
        };
        defaults = $.extend(true,defaults,options)//参数
        var repack = new RepackHighchart();
        repack.obj = defaults.obj;
        repack.styleData = defaults.styleData;
        repack.objData = defaults.data;
        repack.type = defaults.type;
        repack._data = defaults._data;
        repack.urlViewData = defaults.urlViewData;
        repack.callback = defaults.back;

        repack.event();
    }
})(jQuery);