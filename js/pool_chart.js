var chart_pool = {};
var chart_config = {};

var ftime_lab, ttime_lab, itime_lab, otime_lab, flow_tlab, flow_ylab;
var in_tlab, in_ylab;
var out_tlab, out_ylab;
var top5_tlab, top5_tlab1, top5_tlab2, top5_tlab3, top5_tlab4;

var dateFormatter = new am4core.DateFormatter();
var global_datetime_format = "d MMM, yyyy H:m:s";
var axisBreakThreshold = 0.6;

var prevZoomPos = {
    st: 0,
    en: 1
};

var curPos = {
    x: null,
    y: null
};
var curFlow = {
    x: null,
    y: null
};
var curTop5 = {
    x: null,
    y: null
};
var curIn = {
    x: null,
    y: null
};
var curOut = {
    x: null,
    y: null
};

function allChartRefresh() {
    if(chart_pool.flow) chart_create('flow');
    if(chart_pool.in) chart_create('in');
    if(chart_pool.out) chart_create('out');
    if(chart_pool.top5) chart_create('top5');
}

data_not_exists_alert = '';

function bytes_to_bps(value, interval) {
    interval = interval || default_interval;
    return parseFloat(value) * 8 / interval;
}

function bps_to_gbps(value) {
    mbps = parseFloat(value) / 1000 / 1000;
    gbps = mbps / 1000;
    if (gbps > 1) {
        return Math.round(gbps * 10) / 10 + 'Gbps';
    } else {
        return Math.round(mbps * 10) / 10 + 'Mbps';
    }
}

function dispose(chart_id) {
    if (chart_pool[chart_id] && !chart_pool[chart_id].isDisposed()) chart_pool[chart_id].dispose();
}


function chart_create(chart_id) {
    if(chart_pool[chart_id]) {
        chart_pool[chart_id].dispose();
        delete chart_pool[chart_id];
        $('#graph_'+chart_id).html('');
    }
    if(!chart_config[chart_id]) {
        $.getScript(base_url+'/chart/'+chart_id+'.js', function() {
            __chart_create(chart_id);
        });
    }
    else {
        __chart_create(chart_id);
    }
}
function __chart_create(chart_id) {
    chart_pool[chart_id] = am4core.createFromConfig(chart_config[chart_id], 'graph_'+chart_id, 'XYChart');
    callAPI(api[chart_id], default_from, default_to, defaultInterval, chart_id, "t");
}

function zoomIn(from, to) {
    setTimeout(function() {
        if (!from) {
            return;
        }
        defaultInterval = Math.floor((to - from) / defaultZoomPoints / 1000);
        defaultInterval = defaultInterval == 0 ? 1 : defaultInterval;
        default_from = from;
        default_to = to;

        if (to - from < defaultInterval * 20 * 1000) {
            alert('Range very small. reselect the range');
            return;
        }

        if (defaultInterval < 60) {
            defaultInterval = defaultInterval + 's';
        } else if (defaultInterval < 60 * 60) {
            defaultInterval = Math.floor(defaultInterval / 60) + 'm';
        } else {
            defaultInterval = Math.floor(defaultInterval / 60 / 60) + 'h';
        }
        //chart
        allChartRefresh();
        //table
        allTableDataRefresh();
    }, 0);
}

function set_recent_category() {
    var recents = window.localStorage.getItem('range_recent');
    if(recents) {
        recents = JSON.parse(recents);
        var s4 = $('#s4').html('');
        $.each(recents, function() {
            s4.append('<div class="btn-group" role="group" aria-label="First group" style="margin: 10px">\n' +
                '<button type="button" class="btn btn-secondary" onclick="set_new_timerange(\''+this.time_range+'\', \''+this.text+'\', \''+this.from+'\', \''+this.to+'\');">'+this.text+'</button>\n' +
                '<button type="button" class="btn btn-secondary" onclick="remove_recent_cate(this, \''+this.time_range+'\')"><i class="fa fa-close" aria-hidden="true"></i></button>\n' +
            '</div>');
        });
    }
}
function create_axis_break(axis, arr, key) {
    axis.axisBreaks.clear();

    arr = arr.filter(function (a) {
        return a[key];
    });
    arr = arr.sort(function (a, b) {
        return (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
    });

    if(arr.length == 0) {
        return false;
    }
    var total = arr[arr.length - 1][key] - arr[0][key];

    for (var i = 0; i < arr.length - 1; i++) {
        var diff = arr[i + 1][key] - arr[i][key];
        if ((diff / total) >= axisBreakThreshold) {
            axis.min = 0;
            axis.max = arr[arr.length - 1][key] * 1.02;
            axis.strictMinMax = true;

            var axisBreak = axis.axisBreaks.create();
            axisBreak.startValue = arr[i][key];
            axisBreak.endValue = arr[i + 1][key];
            axisBreak.breakSize = 0.005;

            var hoverState = axisBreak.states.create("hover");
            hoverState.properties.breakSize = 1;
            hoverState.properties.opacity = 0.1;
            hoverState.transitionDuration = 1500;

            axisBreak.defaultState.transitionDuration = 1000;
        }
    }
}

function callAPI(apiurl, from, to, interval, graph, day) {
    L7_PROTO_NAME = [];
    if (env == 'test') {
        var sample_json = {
            "took": 34,
            "timed_out": false,
            "_shards": {
                "total": 4,
                "successful": 4,
                "skipped": 0,
                "failed": 0
            },
            "hits": {
                "total": 36942,
                "max_score": 0.0,
                "hits": []
            },
            "aggregations": {
                "q": {
                    "meta": {
                        "type": "split"
                    },
                    "buckets": {
                        "*": {
                            "doc_count": 36942,
                            "time_buckets": {
                                "meta": {
                                    "type": "time_buckets"
                                },
                                "buckets": []
                            },
                            "L7_PROTO_NAME": {
                                "meta": {
                                    "type": "split"
                                },
                                "doc_count_error_upper_bound": 336,
                                "sum_other_doc_count": 14163,
                                "buckets": [
                                    {
                                        "key": "Gentrice-L2TP",
                                        "doc_count": 13802,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "Syslog",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "SSL",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "DNS",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "Unknown",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        };

        var ts;
        if (interval.indexOf('m') > -1) {
            ts = 60 * parseInt(interval.substr(0, interval.length - 1)) * 1000;
        } else if (interval.indexOf('h') > -1) {
            ts = 60 * 60 * parseInt(interval.substr(0, interval.length - 1)) * 1000;
        } else {
            ts = parseInt(interval.substr(0, interval.length - 1)) * 1000;
        }

        for (var i = from; i <= to; i += ts) {
            var y = Math.random() * 200000;
            if (y >= 190000) y = y * 10;
            if (graph == "flow") {
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": parseInt(i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "count": {
                        "value": parseFloat(y)
                    }
                });
            } else if (graph == "top5") {
                for (var j = 0; j < 5; j++) {
                    y = Math.random() * 200000;
                    if (y >= 190000) y = y * 10;
                    y *= 1000;
                    sample_json.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets[j].time_buckets.buckets.push({
                        "key_as_string": (i / 1000).toString(),
                        "key": i,
                        "doc_count": y,
                        "sum(IN_BYTES)": {
                            "value": parseFloat(y)
                        }
                    });
                }
            } else if (graph == "in") {
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": (i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "sum(IN_BYTES)": {
                        "value": parseFloat(y)
                    }
                });
            } else if (graph == "out") {
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": (i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "sum(OUT_BYTES)": {
                        "value": parseFloat(y)
                    }
                });
            }
        }

        var response = JSON.stringify(sample_json);

        if (graph == "flow") {
            render_flow(response, day);
        }
        else if (graph == "top5") {
            render_top5(response, day);
        }
        else if (graph == "in") {
            render_in(response, day);
        }
        else if (graph == "out") {
            render_out(response, day);
        }
    } else {
        var url = '';
        if(env == 'prodtest') {
            url = 'testapi.php';
        }
        else {
            url = 'api.php';
        }
        $.ajax({
            type: "GET",
            url: url,
            data: {
                apiurl: apiurl,
                from: from,
                to: to,
                interval: interval,
                addfilter: get_add_filter_format()
            },
            success: function (response) {
                if (graph == "flow") {
                    render_flow(response, day);
                }
                else if (graph == "top5") {
                    render_top5(response, day);
                }
                else if (graph == "in") {
                    render_in(response, day);
                }
                else if (graph == "out") {
                    render_out(response, day);
                }
            }
        });
    }
}