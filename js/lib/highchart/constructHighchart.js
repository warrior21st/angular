
(function($){
    function RepackHighchart(){
		this.obj,
        this.objData,
		this.urlViewData,
		this.styleData,
        this.callback
    };
    RepackHighchart.prototype.event = function(){
		var o = this;
		var _viewdata = '';
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
				console.log('data error')
            }
        });
		if(_viewdata !=''){
			var _chartdata={
				chart:{type : ''},
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
			
			_chartdata.series = [];
			for(var i=0;i<_viewdata.data.length;i++){
				_chartdata.series.push({type:_viewdata.dataType[i],name:_viewdata.dataName[i],data:_viewdata.data[i]});
			}
			if(this.styleData !=''){
				this.extend(_chartdata,this.styleData);
			}
			console.log(_chartdata)
			this.showChart(_chartdata);
		}
    };

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
							if(typeof(o[p][k]) == 'object'){
								this.extend(o[p][k],n[p][k]);
							}else if(typeof(o[p][k]) == 'string'){
								if(n[p][k] == ''){
									
								}else{
									o[p]=n[p];
								}
							}else if(typeof(o[p][k]) == 'undefined'){
								o[p][k]=n[p][k];
							}
					}
				}
			}
		}else{
			console.log("--"+n);
		}
	};
	RepackHighchart.prototype.showChart = function(data){
		this.obj.highcharts(data);
		
	}

    $.fn.repackHighchart = function(options){
        defaults = {
			obj:this,
			data:'',
			urlViewData:'',
			styleData:'',
            back:function(data){}
        };
        defaults = $.extend(true,defaults,options)//����
        var repack = new RepackHighchart();
		repack.obj = defaults.obj;
		repack.styleData = defaults.styleData;
		repack.objData = defaults.data;
		repack.urlViewData = defaults.urlViewData;
        repack.callback = defaults.back;

        repack.event();
    }
})(jQuery);