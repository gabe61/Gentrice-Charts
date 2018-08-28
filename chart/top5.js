var data_top5 = [];
chart_config.top5 = {
    // Chart title
    "titles": [{
        "text": "Top 5",
        "fontSize": 18,
        "marginBottom": 10
    }],

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
                // cursorPosition.x = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                // cursorPosition.y = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var datalen = chart_pool.top5.data.length / 2;
                var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                cPos = Math.round(cPos);

                ttime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                if (data_top5[cPos]) {
                    top5_tlab.text = "(Unknown)(" + data_top5[cPos]["value1"] + ")";
                    top5_tlab1.text = '(Gentrice)(' + data_top5[cPos]["value2"] + ")";
                    top5_tlab2.text = '(DNS)(' + data_top5[cPos]["value3"] + ")";
                    top5_tlab3.text = '(Syslog)(' + data_top5[cPos]["value4"] + ")";
                    top5_tlab4.text = '(SSL)(' + data_top5[cPos]["value5"] + ")";
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

                zoomIn(from, to, "top5");

            }
        }
    },
    "zoomOutButton": {
        "disabled": true
    }
};
function render_top5(response, day) {
    response = JSON.parse(response);
    data_top5 = [];
    var res_top5 = response.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets;
    var graph = res_top5[0].time_buckets.buckets;
    var all_values = [];
    var interval = graph.length > 0 && graph[0].length >= 2 ? (graph[0][1].key - graph[0][0].key) / 1000 : default_interval;

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
    var color;
    for (var i = 0; i < res_top5.length; i++) {
        color = randomColor({
            luminosity: 'bright',
            hue: 'hux'
        });
        var series = chart_pool.top5.series.push(new am4charts.LineSeries());
        series.name = res_top5[i].key;
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value" + (i + 1);
        series.fillOpacity = "0.3";
        series.stroke = color;
        series.fill = color;
    }
    ttime_lab = chart_pool.top5.createChild(am4core.Label);
    ttime_lab.text = "";
    ttime_lab.fontSize = 15;
    ttime_lab.align = "center";
    ttime_lab.isMeasured = false;
    ttime_lab.x = 130;
    ttime_lab.y = 30;
    top5_tlab = chart_pool.top5.createChild(am4core.Label);
    top5_tlab.text = "(Unknown)";
    top5_tlab.fontSize = 15;
    top5_tlab.align = "center";
    top5_tlab.isMeasured = false;
    top5_tlab.x = 130;
    top5_tlab.y = 50;
    top5_tlab1 = chart_pool.top5.createChild(am4core.Label);
    top5_tlab1.text = "(Gentrice)";
    top5_tlab1.fontSize = 15;
    top5_tlab1.align = "center";
    top5_tlab1.isMeasured = false;
    top5_tlab1.x = 130;
    top5_tlab1.y = 70;
    top5_tlab2 = chart_pool.top5.createChild(am4core.Label);
    top5_tlab2.text = "(DNS)";
    top5_tlab2.fontSize = 15;
    top5_tlab2.align = "center";
    top5_tlab2.isMeasured = false;
    top5_tlab2.x = 130;
    top5_tlab2.y = 90;
    top5_tlab3 = chart_pool.top5.createChild(am4core.Label);
    top5_tlab3.text = "(Syslog)";
    top5_tlab3.fontSize = 15;
    top5_tlab3.align = "center";
    top5_tlab3.isMeasured = false;
    top5_tlab3.x = 130;
    top5_tlab3.y = 110;
    top5_tlab4 = chart_pool.top5.createChild(am4core.Label);
    top5_tlab4.text = "(SSL)";
    top5_tlab4.fontSize = 15;
    top5_tlab4.align = "center";
    top5_tlab4.isMeasured = false;
    top5_tlab4.x = 130;
    top5_tlab4.y = 130;

    setTimeout(function() {
        $('#chart_top5').hide(0).show(0);
    }, 200);
}