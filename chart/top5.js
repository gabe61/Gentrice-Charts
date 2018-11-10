var data_top5 = [];
chart_config.top5 = {
  
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
                if(chart_pool.top5.data.length == 0) return false;
                var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var datalen = chart_pool.top5.data.length / 2;
                var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                cPos = Math.round(cPos);

                ttime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                if (data_top5[cPos]) {
                    top5_tlab.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(255, 0, 0);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Unknown)(' + (data_top5[cPos]['value1'] ? data_top5[cPos]['value1'].toFixed(3) : 0) + ')</span>';
                    top5_tlab1.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(10, 249, 113);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Gentrice)(' + (data_top5[cPos]['value2'] ? data_top5[cPos]['value2'].toFixed(3) : 0) + ')</span>';
                    top5_tlab2.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(239, 255, 1);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(DNS)(' + (data_top5[cPos]['value3'] ? data_top5[cPos]['value3'].toFixed(3) : 0) + ')</span>';
                    top5_tlab3.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(1, 35, 255);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Syslog)(' + (data_top5[cPos]['value4'] ? data_top5[cPos]['value4'].toFixed(3) : 0) + ')</span>';
                    top5_tlab4.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(153, 0, 0);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(SSL)(' + (data_top5[cPos]['value5'] ? data_top5[cPos]['value5'].toFixed(3) : 0) + ')</span>';
                }
                curPos.x = ev.target.xPosition;
                curPos.y = ev.target.yPosition;

                if(chart_pool.in) {
                    curIn.x = curPos.x * chart_pool.in.cursor.maxRight;
                    chart_pool.in.cursor.triggerMove(curIn, true);
                    curIn.y = curPos.y;
                }
                if(chart_pool.out) {
                    curOut.x = curPos.x * chart_pool.out.cursor.maxRight;
                    chart_pool.out.cursor.triggerMove(curOut, true);
                    curOut.y = curPos.y;
                }
                if(chart_pool.flow) {
                    curTop5.x = curPos.x * chart_pool.flow.cursor.maxRight;
                    chart_pool.flow.cursor.triggerMove(curTop5, true);
                    curFlow.x = curPos.x * chart_pool.flow.cursor.maxRight;
                }
            },
            "zoomended": function (ev) {
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                var en = prevZoomPos.st + ev.target.xRange.end * curRange;
                if(chart_pool.flow) chart_pool.flow.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.in) chart_pool.in.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.out) chart_pool.out.xAxes.getIndex(0).zoom({start: st, end: en});

                prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;

            },
            selectended: function (ev) {
                var range = ev.target.xRange;
                var axis = ev.target.chart.xAxes.getIndex(0);
                var from = axis.positionToValue(range.start);
                var to = axis.positionToValue(range.end);

                data_not_exists_alert = 'top5';
                zoomIn(parseInt(from), parseInt(to));

            }
        }
    },
    "zoomOutButton": {
        "disabled": true
    }
};
function render_top5(response, day) {
    try {
        response = JSON.parse(response);
        if(!response.aggregations || response.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets.length === 0) {
            if(data_not_exists_alert == 'top5') {
                data_not_exists_alert = '';
                alert('data is not exists');
            }
            return false;
        }

        data_top5 = [];
        var res_top5 = response.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets;
        L7_PROTO_NAME = [];
        $.each(res_top5, function() {
            L7_PROTO_NAME.push(this.key);
        });

        var graph = res_top5[0].time_buckets.buckets;
        var all_values = [];
        // 
        var ts = 0;
        if (defaultInterval.indexOf('m') > -1) {
            ts = 60 * parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        } else if (defaultInterval.indexOf('h') > -1) {
            ts = 60 * 60 * parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        } else {
            ts = parseInt(defaultInterval.substr(0, defaultInterval.length - 1)) * 1000;
        }

        var interval = graph.length > 0 && graph[0].length >= 2 ? (graph[0][1].key - graph[0][0].key) / 1000 : ts;
        
        for (var j = 0; j < graph.length; j++) {
            var timedata = {};
            timedata["date"] = new Date(graph[j].key);
            for (var i = 0; i < res_top5.length; i++) {
                timedata["value" + (i + 1)] = bytes_to_bps(res_top5[i].time_buckets.buckets[j]["sum(IN_BYTES)"].value, interval);
                all_values.push({"value": timedata["value" + (i + 1)]});
            }
            data_top5.push(timedata);
        }

        create_axis_break(chart_pool.top5.yAxes.getIndex(0), all_values, 'value');
        chart_pool.top5.data = data_top5;
        chart_pool.top5.series = [];
        var colors = [
            'rgb(255, 0, 0)',
            'rgb(10, 249, 113)',
            'rgb(239, 255, 1)',
            'rgb(1, 35, 255)',
            'rgb(153, 0, 0)'
        ];
        for (var i = 0; i < res_top5.length; i++) {
            var series = chart_pool.top5.series.push(new am4charts.LineSeries());
            series.name = res_top5[i].key;
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "value" + (i + 1);
            series.fillOpacity = "0.3";
            series.stroke = colors[i];
            series.fill = colors[i];
        }
        ttime_lab = chart_pool.top5.createChild(am4core.Label);
        ttime_lab.text = "";
        ttime_lab.fontSize = 15;
        ttime_lab.align = "center";
        ttime_lab.isMeasured = false;
        ttime_lab.x = 80;
        ttime_lab.y = 0;
        top5_tlab = chart_pool.top5.createChild(am4core.Label);
        top5_tlab.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(255, 0, 0);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Unknown)</span>';
        top5_tlab.fontSize = 12; // 15 -> 12 px
        top5_tlab.align = "center";
        top5_tlab.isMeasured = false;
        top5_tlab.x = 80;
        top5_tlab.y = 20;
        top5_tlab1 = chart_pool.top5.createChild(am4core.Label);
        top5_tlab1.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(10, 249, 113);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Gentrice)</span>';
        top5_tlab1.fontSize = 12;
        top5_tlab1.align = "center";
        top5_tlab1.isMeasured = false;
        top5_tlab1.x = 80;
        top5_tlab1.y = 40;
        top5_tlab2 = chart_pool.top5.createChild(am4core.Label);
        top5_tlab2.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(239, 255, 1);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(DNS)</span>';
        top5_tlab2.fontSize = 12;
        top5_tlab2.align = "center";
        top5_tlab2.isMeasured = false;
        top5_tlab2.x = 80;
        top5_tlab2.y = 60;
        top5_tlab3 = chart_pool.top5.createChild(am4core.Label);
        top5_tlab3.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(1, 35, 255);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(Syslog)</span>';
        top5_tlab3.fontSize = 12;
        top5_tlab3.align = "center";
        top5_tlab3.isMeasured = false;
        top5_tlab3.x = 80;
        top5_tlab3.y = 80;
        top5_tlab4 = chart_pool.top5.createChild(am4core.Label);
        top5_tlab4.html = '<svg width="50" height="12"><rect width="12" height="12" style="fill:rgb(123, 0, 0);stroke-width:3;stroke:rgb(0,0,0)" /></svg><span>(SSL)</span>';
        top5_tlab4.fontSize = 12;
        top5_tlab4.align = "center";
        top5_tlab4.isMeasured = false;
        top5_tlab4.x = 80;
        top5_tlab4.y = 100;

        setTimeout(function() {
            $('#chart_top5').hide(0).show(0);
        }, 200);
    } catch(e) {}
}