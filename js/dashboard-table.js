var current_range = window.localStorage.getItem('range_current');
var default_from = '';
var default_to = '';

function set_category_time_range(time_range_cate) {
    var tday = new Date();

    switch(time_range_cate) {
        case 'today':
            default_to = tday.getTime();
            tday.setHours(0, 0, 0, 0);
            default_from = tday.getTime();
            break;

        case 'week':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            break;

        case 'month':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            break;

        case 'year':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            break;

        case 'weekday':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            break;

        case 'monthday':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            break;

        case 'yearday':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            break;

        case '24h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (24 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            break;

        case '12h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (12 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            break;

        case '4h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (4 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            break;

        case '1h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 60 * 1000));
            default_from = default_from.getTime();
            break;

        case '15m':
            default_to = tday.getTime();
            default_from = new Date(default_to - (15 * 60 * 1000));
            default_from = default_from.getTime();
            break;

        case '7d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (7 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;

        case '30d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
        case '60d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
        case '90d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (90 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
        case '6mm':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 6 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;

        case '1y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
        case '2y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (2 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
        case '5y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (5 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            break;
    }
}

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
        if(type === 'src-ip') host += 'Src-IP?';
        else if(type === 'desc-ip') host += 'Desc-IP?';
        else if(type === 'src-port') host += 'Src-Port?';
        else if(type === 'desc-port') host += 'Desc-Port?';
        else if(type === 'protocol') host += 'Protocol?';

        return host += 'from='+default_from+'&to='+default_to;
        
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
        var url = get_url(type);
        if(!url) {
            alert('Set Time range');
        }
        else {
            $.ajax({
                url: url,
                dataType: 'json',
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