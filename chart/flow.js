// function create_chat_() {
var data_flow = [];
chart_config.flow = {

    // Chart title
    "titles": [{
        "text": "Flow Count",
        "fontSize": 18,
        "marginBottom": 10
    }],

    "data": [],

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
        // "fill": "red",
        "fill": {
          "type": "RadialGradient",
          "stops": [{
            "color": "red"
          }, {
            "color": "blue"
          }, {
            "color": "green"
          }, {
            "color": "yellow"
          }, {
            "color": "red"
          }]
        }
    }],

    // Add cursor
    "cursor": {
        "behavior": "selectX",
        "events": {
            "cursorpositionchanged": function (ev) {
                var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                var curRange = prevZoomPos.en - prevZoomPos.st;
                var datalen = chart_pool.flow.data.length / 2;
                var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                cPos = Math.round(cPos);

                ftime_lab.text = dateFormatter.format(curDate, global_datetime_format);

                if(data_flow[cPos]) {
                    var title_txt = window.localStorage.getItem('range_current_text');
                    flow_tlab.text = (title_txt ? title_txt : "Today") + "(" + data_flow[cPos]["value1"] + ")";
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
                if(chart_pool.in) chart_pool.in.xAxes.getIndex(0).zoom({start: st, end: en});
                if(chart_pool.out) chart_pool.out.xAxes.getIndex(0).zoom({start: st, end: en});

                prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;
            },
            selectended: function (ev) {
                var range = ev.target.xRange;
                var axis = ev.target.chart.xAxes.getIndex(0);
                var from = parseInt(axis.positionToValue(range.start));
                var to = parseInt(axis.positionToValue(range.end));

                zoomIn(from, to);
            }
        }
    },
    "zoomOutButton": {
        "disabled": true
    }
};

function render_flow(response, day) {
    var res_flow = JSON.parse(response).aggregations.q.buckets['*'].time_buckets.buckets;

    data_flow = [];
    if (day == "t") {
        for (var i = 0; i < res_flow.length; i++) {
            data_flow.push({
                date1: new Date(res_flow[i].key),
                value1: res_flow[i].count.value
            });
        }
        create_axis_break(chart_pool.flow.yAxes.getIndex(0), data_flow, 'value1');
    } else {
        for (var i = 0; i < res_flow.length; i++) {
            data_flow.push({
                date2: new Date(res_flow[i].key),
                value2: res_flow[i].count.value
            });
        }
        create_axis_break(chart_pool.flow.yAxes.getIndex(0), data_flow, 'value2');
    }

    var title_txt = window.localStorage.getItem('range_current_text');

    chart_pool.flow.data = data_flow;

    ftime_lab = chart_pool.flow.createChild(am4core.Label);
    ftime_lab.text = "";
    ftime_lab.fontSize = 15;
    ftime_lab.align = "center";
    ftime_lab.isMeasured = false;
    ftime_lab.x = 80;
    ftime_lab.y = 30;
    flow_tlab = chart_pool.flow.createChild(am4core.Label);
    flow_tlab.text = (title_txt ? title_txt : "Today");
    flow_tlab.fontSize = 15;
    flow_tlab.align = "center";
    flow_tlab.isMeasured = false;
    flow_tlab.x = 80;
    flow_tlab.y = 50;
    flow_ylab = chart_pool.flow.createChild(am4core.Label);
    flow_ylab.text = "";
    flow_ylab.fontSize = 15;
    flow_ylab.align = "center";
    flow_ylab.isMeasured = false;
    flow_ylab.x = 80;
    flow_ylab.y = 70;

    setTimeout(function() {
        $('#chart_flow').hide(0).show(0);
    }, 200);
}
// chart_pool.flow.dataSource.events.on("parseended", function(ev) {
//     console.log(ev);
//     // parsed data is assigned to data source's `data` property
//
// });