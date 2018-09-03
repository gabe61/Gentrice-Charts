var data_in = [];
chart_config.in = {
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
        "fill": "green"
    }],

    // Add cursor
    "cursor": {
        "type": "XYCursor",
        "lineY": {
            "disabled": true
        },
        "lineX": {
            "stroke": "#A01010",
            "strokeWidth": 2,

            "strokeDasharray": ""
        },
        "behavior": "selectX",
        "events": {
            "cursorpositionchanged": function (ev) {
                if(chart_pool.in.data.length == 0) return false;
                var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var datalen = chart_pool.in.data.length / 2;
                var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                cPos = Math.round(cPos);

                itime_lab.text = dateFormatter.format(curDate, global_datetime_format);

                if(data_in[cPos]) {
                    var title_txt = window.localStorage.getItem('range_current_text');
                    in_tlab.text = (title_txt ? title_txt : "Today") + "(" + bps_to_gbps(data_in[cPos]["value1"]) + ")";
                }

                curPos.x = ev.target.xPosition;
                curPos.y = ev.target.yPosition;

                if(chart_pool.flow) {
                    curFlow.x = curPos.x * chart_pool.flow.cursor.maxRight;
                    chart_pool.flow.cursor.triggerMove(curFlow, true);
                    curFlow.y = curPos.y;
                }
                if(chart_pool.out) {
                    curOut.x = curPos.x * chart_pool.out.cursor.maxRight;
                    chart_pool.out.cursor.triggerMove(curOut, true);
                    curOut.y = curPos.y;
                }
                if(chart_pool.top5) {
                    curTop5.x = curPos.x * chart_pool.top5.cursor.maxRight;
                    chart_pool.top5.cursor.triggerMove(curTop5, true);
                    curTop5.y = curPos.y;
                }
            },
            "zoomended": function (ev) {
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                var en = prevZoomPos.st + ev.target.xRange.end * curRange;

                if(chart_pool.top5) chart_pool.top5.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.flow) chart_pool.flow.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.out) chart_pool.out.xAxes.getIndex(0).zoom({start: st, end: en});

                prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;

            },
            selectended: function (ev) {
                var range = ev.target.xRange;
                var axis = ev.target.chart.xAxes.getIndex(0);
                var from = axis.positionToValue(range.start);
                var to = axis.positionToValue(range.end);

                data_not_exists_alert = 'in';
                zoomIn(parseInt(from), parseInt(to));

            }
        }
    },
    "zoomOutButton": {
        "disabled": true
    }
};
function render_in(response, day) {
    response = JSON.parse(response);
    if(!response.aggregations) {
        if(data_not_exists_alert == 'in') {
            data_not_exists_alert = '';
            alert('data is not exists');
        }
        return false;
    }
    data_in = [];
    var res_in = response.aggregations.q.buckets['*'].time_buckets.buckets;
    var interval = res_in.length >= 2 ? (res_in[1].key - res_in[0].key) / 1000 : default_interval;
    if (day == "t") {
        for (var i = 0; i < res_in.length; i++) {
            data_in.push({
                date1: new Date(res_in[i].key),
                value1: bytes_to_bps(res_in[i]["sum(IN_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_pool.in.yAxes.getIndex(0), data_in, 'value1');
    } else {
        for (var i = 0; i < res_in.length; i++) {
            data_in.push({
                date2: new Date(res_in[i].key),
                value2: bytes_to_bps(res_in[i]["sum(IN_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_pool.in.yAxes.getIndex(0), data_in, 'value2');
    }

    var title_txt = window.localStorage.getItem('range_current_text');
    chart_pool.in.data = data_in;
    itime_lab = chart_pool.in.createChild(am4core.Label);
    itime_lab.text = "";
    itime_lab.fontSize = 15;
    itime_lab.align = "center";
    itime_lab.isMeasured = false;
    itime_lab.x = 130;
    itime_lab.y = 30;
    in_tlab = chart_pool.in.createChild(am4core.Label);
    in_tlab.text = (title_txt ? title_txt : "Today");
    in_tlab.fontSize = 15;
    in_tlab.align = "center";
    in_tlab.isMeasured = false;
    in_tlab.x = 130;
    in_tlab.y = 50;
    in_ylab = chart_pool.in.createChild(am4core.Label);
    in_ylab.text = "";
    in_ylab.fontSize = 15;
    in_ylab.align = "center";
    in_ylab.isMeasured = false;
    in_ylab.x = 130;
    in_ylab.y = 70;

    setTimeout(function() {
        $('#chart_in').hide(0).show(0);
    }, 200);
}