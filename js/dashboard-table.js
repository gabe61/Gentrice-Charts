function allTableDataRefresh() {
    ['src', 'desc', 'srcport', 'descport'].forEach(function(tableId) {
        if($('table#table-'+tableId).is('table') == true) {
            set_grid_data(tableId);
        }
    });
}
function table_create(tableId) {
    var grid_container = jQuery("#graph_"+tableId).css('overflow', 'auto');
    $('<table id="table-'+tableId+'" class="table table-striped table-bordered table-hover" width="100%"></table>').appendTo(grid_container);
    set_grid_data(tableId);
}

function set_grid_data(tableId) {
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
        var ts;
        if (defaultInterval.indexOf('m') > -1) {
            ts = 60 * parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        } else if (defaultInterval.indexOf('h') > -1) {
            ts = 60 * 60 * parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        } else {
            ts = parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        }
        for(var i = default_from; i < default_to; i += ts) {
            sample_json.aggregations.list.buckets.push({
                "key": source_list[Math.floor(Math.random() * (1 - source_list_len)) + source_list_len],
                "doc_count": parseInt(Math.random()*ts),
                "in_bytes": {
                    "value": Math.random()*100000
                },
                "out_pkts": {
                    "value": parseInt(50000*Math.random())
                }
            });
        }
        setGrid_data(tableId, sample_json);
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
            $.ajax({
                url: url,
                dataType: 'json',
                data: {
                    apiurl: api[tableId],
                    from: default_from,
                    to: default_to,
                    interval: defaultInterval,
                    addfilter: get_add_filter_format()
                },
                success: function(rdata) {
                    setGrid_data(tableId, rdata);
                }
            });
        }
    }
}

function setGrid_data(tableId, resp_data) {
    var grid_data = [];
    $.each(resp_data.aggregations.list.buckets, function() {
        grid_data.push([
            this.key, (this.in_bytes.value / 1024 / 1024).toFixed(3),
            this.out_pkts.value, this.doc_count
        ]);
    });
    var table_id = '#table-'+tableId
    if($.fn.DataTable.isDataTable( table_id ) === false) {
        $(table_id).DataTable({
            columns: [
                { title: "Source" },
                { title: "MB" },
                { title: "Packets" },
                { title: "Flow Records" }
            ],
            "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'C>r>"+
            "t"+
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        });
    }
    var dataTable = $(table_id).DataTable();
    dataTable.clear();
    dataTable.rows.add(grid_data);
    dataTable.draw();

}