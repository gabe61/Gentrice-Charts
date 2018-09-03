var data_out = [];
chart_config.out = {

    // Set settings and data
    "paddingRight": 40,

    // Create X axes
    "xAxes": [{
        "type": "DateAxis",
        "tooltip": {
            "disabled": true
        },
        "renderer": {
            "grid": {
                "location": 0,
                "strokeOpacity": 0
            },
            "minGridDistance": 60
        }
    }],

    // Create Y axes
    "yAxes": [{
        "type": "ValueAxis",
        "logarithmic": false,
        "numberFormatter": {
            "type": "NumberFormatter",
            "numberFormat": "#.#a'bps'"
        },
        "tooltip": {
            "disabled": true
        },
        "renderer": {
            "minWidth": 35
        }
    }],

    // Create series
    "series": [{
        "id": "s1",
        "type": "LineSeries",
        "dataFields": {
            "dateX": "date1",
            "valueY": "value1"
        },

        "fillOpacity": "0.3",
        "stroke": "#e59165",
        "fill": "#e59165"
    }],

    // Add cursor
    "cursor": {
        "behavior": "selectX",
        "type": "XYCursor",
        "lineY": {
            "disabled": true
        },
        "lineX": {
            "stroke": "#A01010",
            "strokeWidth": 2,

            "strokeDasharray": ""
        },
        "events": {
            "cursorpositionchanged": function (ev) {
                if(chart_pool.out.data.length == 0) return false;
                var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var datalen = chart_pool.out.data.length / 2;
                var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                cPos = Math.round(cPos);

                otime_lab.text = dateFormatter.format(curDate, global_datetime_format);

                if(data_out[cPos]) {
                    var title_txt = window.localStorage.getItem('range_current_text');
                    out_tlab.text = (title_txt ? title_txt : "Today")+"(" + bps_to_gbps(data_out[cPos]["value1"]) + ")";
                }

                curPos.x = ev.target.xPosition;
                curPos.y = ev.target.yPosition;

                if(chart_pool.flow) {
                    curFlow.x = curPos.x * chart_pool.flow.cursor.maxRight;
                    chart_pool.flow.cursor.triggerMove(curFlow, true);
                    curFlow.y = curPos.y;
                }
                if(chart_pool.in) {
                    curIn.x = curPos.x * chart_pool.in.cursor.maxRight;
                    chart_pool.in.cursor.triggerMove(curIn, true);
                    curIn.y = curPos.y;
                }
                if(chart_pool.top5) {
                    curTop5.x = curPos.x * chart_pool.top5.cursor.maxRight;
                    chart_pool.top5.cursor.triggerMove(curTop5, true);
                    curTop5.y = curPos.y;
                }
            },
            "zoomended": function(ev) {
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                var en = prevZoomPos.st + ev.target.xRange.end * curRange;

                if(chart_pool.top5) chart_pool.top5.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.flow) chart_pool.flow.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.in) chart_pool.in.xAxes.getIndex(0).zoom({start: st, end: en});

                prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;

            },
            selectended: function (ev) {
                var range = ev.target.xRange;
                var axis = ev.target.chart.xAxes.getIndex(0);
                var from = axis.positionToValue(range.start);
                var to = axis.positionToValue(range.end);
                data_not_exists_alert = 'out';
                zoomIn(parseInt(from), parseInt(to));
            }
        }
    },
    "zoomOutButton": {
        "disabled": true
    }
};

function render_out(response, day) {
    response = JSON.parse(response);
    if(!response.aggregations || response.aggregations.q.buckets['*'].time_buckets.buckets.length == 0) {
        if(data_not_exists_alert == 'out') {
            data_not_exists_alert = '';
            alert('data is not exists');
        }
        return false;
    }
    var res_out = response.aggregations.q.buckets['*'].time_buckets.buckets;
    data_out = [];
    var interval = res_out.length >= 2 ? (res_out[1].key - res_out[0].key) / 1000 : default_interval;
    if (day == "t") {
        for (var i = 0; i < res_out.length; i++) {
            data_out.push({
                date1: new Date(res_out[i].key),
                value1: bytes_to_bps(res_out[i]["sum(OUT_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_pool.out.yAxes.getIndex(0), data_out, 'value1');
    } else {
        for (var i = 0; i < res_out.length; i++) {
            data_out.push({
                date2: new Date(res_out[i].key),
                value2: bytes_to_bps(res_out[i]["sum(OUT_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_pool.out.yAxes.getIndex(0), data_out, 'value2');
    }
    chart_pool.out.data = data_out;

    var title_txt = window.localStorage.getItem('range_current_text');
    otime_lab = chart_pool.out.createChild(am4core.Label);
    otime_lab.text = "";
    otime_lab.fontSize = 15;
    otime_lab.align = "center";
    otime_lab.isMeasured = false;
    otime_lab.x = 130;
    otime_lab.y = 30;
    out_tlab = chart_pool.out.createChild(am4core.Label);
    out_tlab.text = (title_txt ? title_txt : "Today");
    out_tlab.fontSize = 15;
    out_tlab.align = "center";
    out_tlab.isMeasured = false;
    out_tlab.x = 130;
    out_tlab.y = 50;
    out_ylab = chart_pool.out.createChild(am4core.Label);
    out_ylab.text = "";
    out_ylab.fontSize = 15;
    out_ylab.align = "center";
    out_ylab.isMeasured = false;
    out_ylab.x = 130;
    out_ylab.y = 70;

    setTimeout(function() {
        $('#chart_out').hide(0).show(0);
    }, 200);
}