var env = "test";

var chart_pool = {};
var chart_config = {};

var ftime_lab, ttime_lab, itime_lab, otime_lab, flow_tlab, flow_ylab;
var in_tlab, in_ylab;
var out_tlab, out_ylab;
var top5_tlab, top5_tlab1, top5_tlab2, top5_tlab3, top5_tlab4;

var default_interval = 5;
var _default_interval;
var default_from;
var default_to;

var dateFormatter = new am4core.DateFormatter();
var global_datetime_format = "d MMM, yyyy H:m:s";
var axisBreakThreshold = 0.6;
var defaultZoomPoints = 100;
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

API_url = {
    flow: 'http://192.168.10.133:60080/api/visualize/Overview-Flow-Count',
    top5: 'http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5',
    in: 'http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In',
    out: 'http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out'

};


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


function refresh_widgets() {
    $('#widget-grid-1').jarvisWidgets({
        grid: 'article',
        widgets: '.jarviswidget',
        localStorage: localStorageJarvisWidgets,
        deleteSettingsKey: '#deletesettingskey-options',
        settingsKeyLabel: 'Reset settings?',
        deletePositionKey: '#deletepositionkey-options',
        positionKeyLabel: 'Reset position?',
        sortable: sortableJarvisWidgets,
        buttonsHidden: false,
        // toggle button
        toggleButton: true,
        toggleClass: 'fa fa-minus | fa fa-plus',
        toggleSpeed: 200,
        onToggle: function () {},
        // delete btn
        deleteButton: true,
        deleteMsg: 'Warning: This action cannot be undone!',
        deleteClass: 'fa fa-times',
        deleteSpeed: 200,
        onDelete: function () {},
        // edit btn
        editButton: true,
        editPlaceholder: '.jarviswidget-editbox',
        editClass: 'fa fa-cog | fa fa-save',
        editSpeed: 200,
        onEdit: function () {},
        // color button
        colorButton: true,
        // full screen
        fullscreenButton: true,
        fullscreenClass: 'fa fa-expand | fa fa-compress',
        fullscreenDiff: 3,
        onFullscreen: function () {},
        // custom btn
        customButton: false,
        customClass: 'folder-10 | next-10',
        customStart: function () {
            alert('Hello you, this is a custom button...');
        },
        customEnd: function () {
            alert('bye, till next time...');
        },
        // order
        buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
        opacity: 1.0,
        dragHandle: '> header',
        placeholderClass: 'jarviswidget-placeholder',
        indicator: true,
        indicatorTime: 600,
        ajax: true,
        timestampPlaceholder: '.jarviswidget-timestamp',
        timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
        refreshButton: true,
        refreshButtonClass: 'fa fa-refresh',
        labelError: 'Sorry but there was a error:',
        labelUpdated: 'Last Update:',
        labelRefresh: 'Refresh',
        labelDelete: 'Delete widget:',
        afterLoad: function () {},
        rtl: false, // best not to toggle this!
        onChange: function () {

        },
        onSave: function () {

        },
        ajaxnav: $.navAsAjax
    });
}
function create_chart_widget(chart_id) {
    $('#chart-widgets-container').children('article.'+chart_id+'_panel').append('<div class="jarviswidget" data-widget-editbutton="false" data-widget-deletebutton="false" id="chart-widget-'+chart_id+'">\n' +
        '                        <header><h2><strong>'+chart_id.toUpperCase()+'</strong> <i>chart</i></h2></header>' +
        '                        <div>' +
        '                            <div class="widget-body" style="height: 100%; min-height: 500px;"><div id="chart_'+chart_id+'" style="min-height: 500px;height: 100%"></div></div>' +
        '                        </div>'+
        '                    </div>');
    create_chart(chart_id);
}

function create_chart(chart_id) {
    if(chart_pool[chart_id]) {
        chart_pool[chart_id].dispose();
        delete chart_pool[chart_id];
        $('#chart_'+chart_id).html('');
    }

    if(!chart_config[chart_id]) {
        $.getScript(base_url+'/chart/'+chart_id+'.js', function() {
            __create_chart(chart_id);
        });
    }
    else {
        __create_chart(chart_id);
    }
}
function __create_chart(chart_id) {
    chart_pool[chart_id] = am4core.createFromConfig(chart_config[chart_id], 'chart_'+chart_id, 'XYChart');
    callAPI(API_url[chart_id], default_from, default_to, _default_interval, chart_id, "t");
}

function set_category_time_range(time_range_cate) {
    var tday = new Date();

    switch(time_range_cate) {
        case 'today':
            default_to = tday.getTime();
            tday.setHours(0, 0, 0, 0);
            default_from = tday.getTime();
            _default_interval = '2m';
            break;

        case 'week':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            _default_interval = '10h';
            break;

        case 'month':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            _default_interval = '24h';
            break;

        case 'year':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            _default_interval = '120h';
            break;

        case 'weekday':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            _default_interval = '24h';
            break;

        case 'monthday':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            _default_interval = '24h';
            break;

        case 'yearday':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            _default_interval = '24h';
            break;

        case '24h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (24 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            _default_interval = '10m';
            break;

        case '12h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (12 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            _default_interval = '5m';
            break;

        case '4h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (4 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            _default_interval = '1m';
            break;

        case '1h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 60 * 1000));
            default_from = default_from.getTime();
            _default_interval = '10s';
            break;

        case '15m':
            default_to = tday.getTime();
            default_from = new Date(default_to - (15 * 60 * 1000));
            default_from = default_from.getTime();
            _default_interval = '2s';
            break;

        case '7d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (7 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '5h';
            break;

        case '30d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '5h';
            break;
        case '60d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '5h';
            break;
        case '90d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (90 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '24h';
            break;
        case '6mm':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 6 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '5h';
            break;

        case '1y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '240h';
            break;
        case '2y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (2 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '240h';
            break;
        case '5y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (5 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            _default_interval = '480h';
            break;
    }
}


function zoomIn(from, to) {
    setTimeout(() => {
        if (!from) {
            return;
        }
        _default_interval = Math.floor((to - from) / defaultZoomPoints / 1000);
        _default_interval = _default_interval == 0 ? 1 : _default_interval;
        default_from = from;
        default_to = to;

        if (to - from < _default_interval * 20 * 1000) {
            alert('Range very small. reselect the range');
            return;
        }

        if (_default_interval < 60) {
            _default_interval = _default_interval + 's';
        } else if (_default_interval < 60 * 60) {
            _default_interval = Math.floor(_default_interval / 60) + 'm';
        } else {
            _default_interval = Math.floor(_default_interval / 60 / 60) + 'h';
        }

        if(chart_pool.flow) create_chart('flow');
        if(chart_pool.in) create_chart('in');
        if(chart_pool.out) create_chart('out');
        if(chart_pool.top5) create_chart('top5');
    }, 0)

}

function set_recent_category() {
    var recents = window.localStorage.getItem('range_recent');
    if(recents) {
        recents = JSON.parse(recents);
        var s4 = $('#s4').html('');
        $.each(recents, function() {
            s4.append('<div class="btn-group" role="group" aria-label="First group" style="margin: 10px">\n' +
                '                                            <button type="button" class="btn btn-secondary" onclick="set_new_timerange(\''+this.time_range+'\', \''+this.text+'\', \''+this.from+'\', \''+this.to+'\');">'+this.text+'</button>\n' +
                '                                            <button type="button" class="btn btn-secondary" onclick="remove_recent_cate(this, \''+this.time_range+'\')"><i class="fa fa-close" aria-hidden="true"></i></button>\n' +
                '                                        </div>');
        });
    }
}
function set_new_timerange(time_range, text, from, to) {
    $('#btn-chart-filter').text(text);
    window.localStorage.setItem('range_current_text', text);

    if(from && to && from !== 'undefined' && to !== 'undefined') {
        zoomIn(parseInt(from), parseInt(to));
        time_range = JSON.stringify({
            from: from,
            to: to,
            time_range: time_range
        });
    }
    else {
        set_category_time_range(time_range);
        if(chart_pool.flow) create_chart('flow');
        if(chart_pool.in) create_chart('in');
        if(chart_pool.out) create_chart('out');
        if(chart_pool.top5) create_chart('top5');
    }
    window.localStorage.setItem('range_current', time_range);
}
function remove_recent_cate(btn, time_range) {
    $(btn).closest('.btn-group').remove();
    var range_recents = JSON.parse(window.localStorage.getItem('range_recent'));
    $.each(range_recents, function(range_index) {
        if(this.time_range === time_range) {
            range_recents.splice(range_index, 1);
            return false;
        }
    });
    window.localStorage.setItem('range_recent', JSON.stringify(range_recents));
}

$(function() {
    let img_list = $('#chart-type-container').find('img');
    var current_range = window.localStorage.getItem('range_current');
    if(current_range) {
        if(current_range.indexOf('{"') === -1) {
            set_category_time_range(current_range);
        }
        else {
            current_range = JSON.parse(current_range);
            default_to = parseInt(current_range.to);
            default_from = parseInt(current_range.from);

            _default_interval = Math.floor((default_to - default_from) / defaultZoomPoints / 1000);
            _default_interval = _default_interval == 0 ? 1 : _default_interval;

            if (_default_interval < 60) {
                _default_interval = _default_interval + 's';
            } else if (_default_interval < 60 * 60) {
                _default_interval = Math.floor(_default_interval / 60) + 'm';
            } else {
                _default_interval = Math.floor(_default_interval / 60 / 60) + 'h';
            }
        }
        $('#btn-chart-filter').text(window.localStorage.getItem('range_current_text'));
    }
    else set_category_time_range('today');
    // return;

    //generate recents
    set_recent_category();

    img_list.imgCheckbox({
        onclick: (el) => {
            $('#widget-grid-1').jarvisWidgets('destroy');
            var isChecked = el.hasClass("imgChked");
            var chart_id = el.children('img').attr('value');
            var chart_store_data = window.localStorage.getItem('chart_store_data');
            if(!chart_store_data) {
                chart_store_data = [];
            }
            else {
                chart_store_data = chart_store_data.split(',');
            }
            if(isChecked === true) {
                create_chart_widget(chart_id);
                chart_store_data.push(chart_id);
            }
            else {
                $('#chart-widget-'+chart_id).remove();
                if(chart_pool[chart_id]) {
                    chart_pool[chart_id].dispose();
                    delete chart_pool[chart_id];
                    delete chart_config[chart_id];
                }
                chart_store_data.splice(chart_store_data.indexOf(chart_id), 1);
            }
            if(chart_store_data.length == 0) {
                window.localStorage.removeItem('chart_store_data');
            }
            else {
                window.localStorage.setItem('chart_store_data', chart_store_data);
            }
            refresh_widgets();
        }
    });
    var chart_store_data = window.localStorage.getItem('chart_store_data');
    if(chart_store_data) {
        chart_store_data = chart_store_data.split(',');
        chart_store_data.forEach(function(chart_id) {
            img_list.parent().children('[value="'+chart_id+'"]').select();
            create_chart_widget(chart_id);
        });
        refresh_widgets();
    }
    $('#btn-chart-filter').click(function() {
        var container = $('#chart-filter-panel');
        if(container.css('display') === 'block') {
            container.stop(true, true).slideUp();
        }
        else {
            container.stop(true, true).slideDown();
        }
    });
    $('#chart-filter-panel').hide(0);
    $('#time-range').find('a').click(function() {
        var range_cate = this.getAttribute('value');
        var range_recents = window.localStorage.getItem('range_recent');

        window.localStorage.setItem('range_current', range_cate);
        $('#btn-chart-filter').text(this.textContent);
        window.localStorage.setItem('range_current_text', this.textContent);

        if(!range_recents) range_recents = [];
        else range_recents = JSON.parse(range_recents);
        var flag_addrecent = true;
        var each_range;
        for(each_range of range_recents) {
            if(each_range.time_range === range_cate) {
                flag_addrecent = false;
                break;
            }
        }
        if(flag_addrecent === true) {
            range_recents.push({
                time_range: range_cate,
                text: this.textContent
            });

            //register_time_range
            window.localStorage.setItem('range_recent', JSON.stringify(range_recents));
            set_recent_category();
        }
        //store range category
        set_new_timerange(range_cate, this.textContent);
    });

    $('div[type]').find('input,select').change(function() {
        var area = $(this).closest('div[type]');
        var input = area.find('input[type="number"]');
        var select = area.find('select');
        var chkbox = area.find('input[type="checkbox"]');

        var number = input.val();
        var val;
        if(/^-?\d+\.?\d*$/.test(number) === false) {
            input.val(1);
            val = 1;
        }
        else {
            val = parseInt(number);
        }
        if(val < 1) {
            input.val(1);
            val = 1;
        }
        var tday = new Date();
        var tto = tday.getTime();
        var range_cate = select.val();
        var calc_date;
        if(range_cate === 'h') {
            calc_date = new Date(tto - (val * 3600 * 1000));
            if(chkbox.prop('checked') === true) {
                calc_date.setMinutes(0);
                calc_date.setSeconds(0);
            }
            area.find('span').text('Hour');
        }
        else if(range_cate === 'm') {
            calc_date = new Date(tto - (val * 60 * 1000));
            if(chkbox.prop('checked') === true) {
                calc_date.setSeconds(0);
            }
            area.find('span').text('Minute');
        }
        if(range_cate === 's') {
            calc_date = new Date(tto - (val * 1000));
            if(chkbox.prop('checked') === true) {
                calc_date.setMilliseconds(0);
            }
            area.find('span').text('Second');
        }

        area.data('date', calc_date);
        area.find('.calculated-time').text(calc_date.toString().substring(0, calc_date.toString().indexOf('GMT')));
    });
});

function time_range_render_chart() {
    var dom_from = $('div[type="from"]');
    var dom_to = $('div[type="to"]');

    var from = dom_from.data('date').getTime();
    var to = dom_to.data('date').getTime();

    if(!from || !to) {
        alert('Invalid time range.');
    }
    else {
        var diff = Math.floor((to - from) / defaultZoomPoints / 1000);
        diff = diff == 0 ? 1 : diff;

        if (to - from < diff * 20 * 1000) {
            alert('Range very small. reselect the range');
            return;
        }
        else {
            var text = '~ '+dom_from.find('input[type="number"]').val() +' '+dom_from.find('span').text()
                + 's ago to ~ in '
                + dom_to.find('input[type="number"]').val() +' '+ dom_to.find('span').text() + 's ago';

            var range_recents = window.localStorage.getItem('range_recent');

            window.localStorage.setItem('range_current', JSON.stringify({from: from, to: to}));
            $('#btn-chart-filter').text(text);
            window.localStorage.setItem('range_current_text', text);

            if(!range_recents) range_recents = [];
            else range_recents = JSON.parse(range_recents);
            var flag_addrecent = true;
            var each_range;

            var new_each_range = (from + to).toString(16);
            for(each_range of range_recents) {
                if(each_range.time_range === new_each_range) {
                    flag_addrecent = false;
                    break;
                }
            }
            if(flag_addrecent === true) {
                range_recents.push({
                    time_range: new_each_range,
                    text: text,
                    to: to,
                    from: from
                });

                //register_time_range
                window.localStorage.setItem('range_recent', JSON.stringify(range_recents));
                set_recent_category();

                zoomIn(from, to);
            }
        }
    }
}

function callAPI(apiurl, from, to, interval, graph, day) {
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
        $.ajax({
            type: "GET",
            url: "api.php",
            data: {
                apiurl: apiurl,
                from: from,
                to: to,
                interval: interval
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
function create_axis_break(axis, arr, key) {
    axis.axisBreaks.clear();

    arr = arr.filter(function (a) {
        return a[key];
    });
    arr = arr.sort(function (a, b) {
        return (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
    });

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