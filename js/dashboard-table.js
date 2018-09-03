var defaultZoomPoints = 100;
var current_range = window.localStorage.getItem('range_current');
var default_from = '';
var default_to = '';

if(current_range.indexOf('{"') === -1) {
    set_category_time_range(current_range);
}
else {
    current_range = JSON.parse(current_range);
    default_to = current_range.to;
    default_from = current_range.from;
}


function get_url(type) {
    

    if(default_from > 0 && default_to > 0) {

        var host = 'http://192.168.10.133:60080/api/visualize/Top-NetFlow-';
        if(type === 'src-ip') host += 'Src-IP';
        else if(type === 'desc-ip') host += 'Desc-IP';
        else if(type === 'src-port') host += 'Src-Port';
        else if(type === 'desc-port') host += 'Desc-Port';
        else if(type === 'protocol') host += 'Protocol';        
        return host;
    }
    
    return false;
}

function set_grid_data(type) {
   var sample_json = {
      "took": 4,
      "timed_out": false,
      "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": 579,
        "max_score": 0,
        "hits": []
      },
      "aggregations": {
        "list": {
          "doc_count_error_upper_bound": 0,
          "sum_other_doc_count": 0,
          "buckets": [
                // {
                //   "key": "DNS",
                //   "doc_count": parseInt(Math.random()*500),
                //   "in_bytes": {
                //     "value": Math.random()*100000
                //   },
                //   "out_pkts": {
                //     "value": 222
                //   }
                // }
              ]
            }
        }
    };

    if(env === 'test') {
        var source_list = [
            'HTTP', 'Skype', 'SNMP', 'NTP', 'Unknown', 'DHCP', 'SSL'
        ];
        var source_list_len = source_list.length;
        for(var i = 0; i < 500; i ++) {
            sample_json.aggregations.list.buckets.push({
                "key": source_list[Math.floor(Math.random() * (1 - source_list_len)) + source_list_len],
                "doc_count": parseInt(Math.random()*500),
                "in_bytes": {
                    "value": Math.random()*100000
                },
                "out_pkts": {
                    "value": parseInt(50000*Math.random())
                }
            });
        }
        setGrid_data(type, sample_json);
    }
    else {
        var url = '';
        if(env == 'prodtest') {
            url = 'testapi.php';
        }
        else {
            url = 'api.php';
        }
        if(!url) {
            alert('Set Time range');
        }
        else {
            var to = default_to;
            var from = default_from;
            var _default_interval = Math.floor((to - from) / defaultZoomPoints / 1000);
            _default_interval = _default_interval == 0 ? 1 : _default_interval;
            if (_default_interval < 60) {
                _default_interval = _default_interval + 's';
            } else if (_default_interval < 60 * 60) {
                _default_interval = Math.floor(_default_interval / 60) + 'm';
            } else {
                _default_interval = Math.floor(_default_interval / 60 / 60) + 'h';
            }

            $.ajax({
                url: url,
                dataType: 'json',
                data: {
                    apiurl: get_url(type),
                    from: from,
                    to: to,
                    interval: _default_interval
                },
                success: function(rdata) {
                    setGrid_data(type, rdata);
                }
            });
        }
    }
}

function setGrid_data(type, resp_data) {
    var grid_data = [];
    $.each(resp_data.aggregations.list.buckets, function() {
        grid_data.push({
            source: this.key,
            mb: (this.in_bytes.value / 1024 / 1024).toFixed(3),
            packets: this.out_pkts.value,
            records: this.doc_count
        });
    });
    $('#'+type).jqGrid('setGridParam', {data: grid_data}).trigger('reloadGrid');
}
$(document).ready(function() {
	jQuery("#src-ip").jqGrid({
		datatype : "local",
		height : 'auto',
		colNames : ['Source', 'MB', 'Packets', 'Flow Records'],
		colModel : [
            // { name : 'id', index : 'id' },
			{ name : 'source', index : 'source' },
			{ name : 'mb', index : 'mb' },
			{ name : 'packets', index : 'packets' },
			{ name : 'records', index : 'records' }
        ],
		rowNum : 10,
		rowList : [10, 20, 30],
		pager : '#pjqgrid_src_ip',
		sortname : 'source',
		toolbarfilter: true,
		viewrecords : true,
		sortorder : "asc",
		caption : "Top Sources",
		multiselect : true,
		autowidth : true
	});

    jQuery("#desc-ip").jqGrid({
        datatype : "local",
        height : 'auto',
        colNames : ['Description', 'MB', 'Packets', 'Flow Records'],
        colModel : [
            // { name : 'id', index : 'id' },
            { name : 'source', index : 'source' },
            { name : 'mb', index : 'mb' },
            { name : 'packets', index : 'packets' },
            { name : 'records', index : 'records' }
        ],
        rowNum : 10,
        rowList : [10, 20, 30],
        pager : '#pjqgrid_desc_ip',
        sortname : 'source',
        toolbarfilter: true,
        viewrecords : true,
        sortorder : "asc",
        caption : "Top Description",
        multiselect : true,
        autowidth : true
    });


    jQuery("#src-port").jqGrid({
        datatype : "local",
        height : 'auto',
        colNames : ['Source', 'MB', 'Packets', 'Flow Records'],
        colModel : [
            // { name : 'id', index : 'id' },
            { name : 'source', index : 'source' },
            { name : 'mb', index : 'mb' },
            { name : 'packets', index : 'packets' },
            { name : 'records', index : 'records' }
        ],
        rowNum : 10,
        rowList : [10, 20, 30],
        pager : '#pjqgrid_src_port',
        sortname : 'source',
        toolbarfilter: true,
        viewrecords : true,
        sortorder : "asc",
        caption : "Top Sources Ports",
        multiselect : true,
        autowidth : true
    });


    jQuery("#desc-port").jqGrid({
        datatype : "local",
        height : 'auto',
        colNames : ['Description', 'MB', 'Packets', 'Flow Records'],
        colModel : [
            // { name : 'id', index : 'id' },
            { name : 'source', index : 'source' },
            { name : 'mb', index : 'mb' },
            { name : 'packets', index : 'packets' },
            { name : 'records', index : 'records' }
        ],
        rowNum : 10,
        rowList : [10, 20, 30],
        pager : '#pjqgrid_desc_port',
        sortname : 'source',
        toolbarfilter: true,
        viewrecords : true,
        sortorder : "asc",
        caption : "Top Description Ports",
        multiselect : true,
        autowidth : true
    });


    set_grid_data('src-ip');
    set_grid_data('desc-ip');
    set_grid_data('src-port');
    set_grid_data('desc-port');
    set_grid_data('protocol');
});

$(window).on('resize.jqGrid', function () {
	$("#jqgrid").jqGrid( 'setGridWidth', '50%' );
})