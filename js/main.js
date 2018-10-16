var defaultZoomPoints = 100;
var default_interval = 5;
var defaultInterval;
var default_from;
var default_to;

var L7_PROTO_NAME = [];

var filter_apply = true;

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
        onFullscreen: function (container) {
            if($('#jarviswidget-fullscreen-mode').is('div') === true) {
                container.find('.widget-body').height('100%');
            }
            else {
                container.find('.widget-body').height(300);
            }
        },
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

function createGraphWidget(graphConf, graphId) {
    var chart_container = $('#chart-widgets-container');
    var selectArticle = '';
    var article1 = chart_container.children(':first');
    var article2 = chart_container.children(':last');

    if(article1.children('div').length > article2.children('div').length) {
        selectArticle = article2;
    }
    else {
        selectArticle = article1;
    }

    selectArticle.append('<div class="jarviswidget" data-widget-editbutton="false" data-widget-deletebutton="false" id="graph-widget-'+graphId+'">\n' +
        '                        <header><h2><strong>'+graphConf.label.toUpperCase()+'</strong></h2></header>' +
        '                        <div style="height: 100%;">' +
        '                            <div class="widget-body" style="height: 300px;"><div id="graph_'+graphId+'" style="height: 100%"></div></div>' +
        '                        </div>'+
        '                    </div>');
    eval(graphConf.type+'_create(graphId)');
}

//time range
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
        allChartRefresh();
        allTableDataRefresh();
    }
    window.localStorage.setItem('range_current', time_range);

    $('#chart-filter-panel').hide(0);
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

function go_from_to(from, to, text) {
    var range_recents = window.localStorage.getItem('range_recent');
    $('#btn-chart-filter').text(text);

    window.localStorage.setItem('range_current', JSON.stringify({from: from, to: to}));

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
    $('#chart-filter-panel').hide(0);
}

function time_range_render_chart() {
    var dom_from = $('div[type="from"]');
    var dom_to = $('div[type="to"]');

    var from = dom_from.data('date');
    var to = dom_to.data('date');
    if(!from || !to) {
        alert('Input time range value.');
        return false;
    }
    from = from.getTime();
    to = to.getTime();

    if(!from || !to) {
        alert('Invalid time range.');
    }
    else {
        if (to - from < 1000) {
            alert('Time range must be at least 1 second.');
            return;
        }
        var text = '~ '+dom_from.find('input[type="number"]').val() +' '+dom_from.find('span').text()
                + 's ago to ~ in '
                + dom_to.find('input[type="number"]').val() +' '+ dom_to.find('span').text() + 's ago';

        go_from_to(from, to, text);
    }
}

function absolute_time_range() {
    var from = $('#datetimepicker_from').data('DateTimePicker').date().toDate();
    var to = $('#datetimepicker_to').data('DateTimePicker').date().toDate();

    var text = from.toString().substr(0, from.toString().indexOf(' GMT'))
        + ' ~ '
        + to.toString().substr(0, to.toString().indexOf(' GMT'));

    from = from.getTime();
    to = to.getTime();
    if (to - from < 1000) {
        alert('Time range must be at least 1 second.');
        return;
    }

    go_from_to(from, to, text);
}
$(function() {
    $('body').addClass('minified');
    $(document).click(function(e) {
        if($(e.target).closest('#chart-filter-panel').is('article') !== true) {
            $('#chart-filter-panel').hide(0);
        }
    });
    $('#chart-filter-panel').hide(0);
    //init filters
    var btn_panel = $('#add-filter-panel');
    var filters = window.localStorage.getItem('filters');
    if(filters) {
        filters = JSON.parse(filters);
        $.each(filters, function() {
            var btn = $('<button class="btn '+(this.disable === true ? 'disabled btn-danger' : 'btn-primary')+' filter-item"><i class="fa fa-thumb-tack"></i> '+this.label+'</button>').appendTo(btn_panel);

            btn.popover({
                content: '<div class="btn-group">\n' +
                    '            <button class="btn btn-primary toolbar-pin"><i class="fa fa-thumb-tack"></i></button>\n' +
                    '            <button class="btn btn-primary toolbar-disable-enable"><i class="fa '+(this.disable === true ? 'fa-ban' : 'fa-circle-o')+'"></i></button>\n' +
                    '            <button class="btn btn-primary toolbar-trash"><i class="fa fa-trash"></i></button>\n' +
                    '            <button class="btn btn-primary toolbar-edit"><i class="fa fa-edit"></i></button>\n' +
                    '         </div>',
                placement: 'bottom',
                html: true
            });

            btn.data('filter', this);
        });
    }
    var current_range = window.localStorage.getItem('range_current');
    if(current_range) {
        if(current_range.indexOf('{"') === -1) {
            set_category_time_range(current_range);
        }
        else {
            current_range = JSON.parse(current_range);
            default_to = parseInt(current_range.to);
            default_from = parseInt(current_range.from);

            defaultInterval = Math.floor((default_to - default_from) / defaultZoomPoints / 1000);
            defaultInterval = defaultInterval == 0 ? 1 : defaultInterval;

            if (defaultInterval < 60) {
                defaultInterval = defaultInterval + 's';
            } else if (defaultInterval < 60 * 60) {
                defaultInterval = Math.floor(defaultInterval / 60) + 'm';
            } else {
                defaultInterval = Math.floor(defaultInterval / 60 / 60) + 'h';
            }
        }
        $('#btn-chart-filter').text(window.localStorage.getItem('range_current_text'));
    }
    else set_category_time_range('today');

    //generate recents
    set_recent_category();

    $('#chartTypeContainer').find(':checkbox').change(function() {
        $('#widget-grid-1').jarvisWidgets('destroy');
        //--------------------------
        var isChecked = this.checked;
        var graphId = this.value;

        var currGraphConfig = {
            type: this.getAttribute('data-type'),
            label: $(this).next().text().trim()
        };
        //--------------------------

        var chart_store_data = window.localStorage.getItem('chart_store_data');
        if(!chart_store_data) {
            chart_store_data = {};
        }
        else {
            chart_store_data = JSON.parse(chart_store_data);
        }
        if(isChecked === true) {
            createGraphWidget(currGraphConfig, graphId);
            chart_store_data[graphId] = currGraphConfig;
        }
        else {
            $('#graph-widget-'+graphId).remove();

            if(chart_pool[graphId]) {
                chart_pool[graphId].dispose();
                delete chart_pool[graphId];
                delete chart_config[graphId];
            }
            delete chart_store_data[graphId];
        }
        if($.isEmptyObject(chart_store_data) == true) {
            window.localStorage.removeItem('chart_store_data');
        }
        else {
            window.localStorage.setItem('chart_store_data', JSON.stringify(chart_store_data));
        }
        refresh_widgets();
    });
    var chart_store_data = window.localStorage.getItem('chart_store_data');
    if(chart_store_data) {
        chart_store_data = JSON.parse(chart_store_data);
        $.each(chart_store_data, function(graphId) {
            $('#checkbox-'+graphId).prop('checked', true).trigger('change');
        });
    }
    $('#btn-chart-filter').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var container = $('#chart-filter-panel');
        if(container.css('display') === 'block') {
            container.hide(0);
        }
        else {
            container.show(0);
        }
    });
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
        $('#chart-filter-panel').hide(0);
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

    $('#datetimepicker_from, #datetimepicker_to').datetimepicker({
        inline: true,
        sideBySide: true
    });

    //add filter
    $('#filter-category, #filter-operator, #transport').select2();
    $('#filter-category').on("select2:select", function(e) {
        var data = e.params.data;
        var exists_filter_data;
        var filter_win_type = $('#add-filter-title').text();
        filter_apply = true;

        if(filter_win_type === 'Add Filter') {
            $('#add-filter-panel').children('button').each(function() {
                exists_filter_data = $(this).data('filter');
                if(exists_filter_data.filter === data.id) {
                    filter_apply = false;
                    return true;
                }
            });
        }
        if(filter_apply === false) {
            alert('Its filter already exists. so can\'t create filter');
        }
        else {
            var filter_role = '';
            $('.filter-value-area').children('input,select').val('').trigger('change').css('display', 'none').each(function() {
                filter_role = this.getAttribute('data-role');
                if(filter_role.includes(data.id) === true) {
                    if(data.id === 'transport') {
                        $(this).next().css('display', 'block');
                    }
                    else {
                        $(this).attr('placeholder', data.element.innerText).show(0)
                        $('#transport').next().css('display', 'none');
                    }
                    return false;
                }
            });
        }
    });

    $('#add-filter-panel').on('mouseenter', 'button.btn', function(evt) {
        var that = $(this);
        that.popover('show');
        that.next('.popover').one('mouseenter', function() {
            that.data('hovered', true);
        }).one('mouseleave', function() {
            that.removeData('hovered');
            that.popover('hide');
        });
    }).on('mouseleave', 'button.btn', function() {
        var that = $(this);
        setTimeout(function() {
            if(that.data('hovered') !== true) {
                that.popover('hide');
                that.next('.popover').off('mouseleave mouseenter');
            }
        }, 100);
    });

    //toolbar init
    btn_panel.delegate('.toolbar-pin', 'click', function() {
        var pinItem = $(this);
        var thatIcon = pinItem.children();
        var reversal = thatIcon.hasClass('reversal');
        var btn = pinItem.closest('div.popover').prev();

        var popover_html = $(btn.data('bs.popover').options.content);
        if(reversal === true) {
            thatIcon.removeClass('reversal');
            popover_html.find('.fa-thumb-tack').removeClass('reversal');
            saveFilter(btn.data('filter'));
            btn.html('<i class="fa fa-thumb-tack"></i> ' + btn.text());
        }
        else {
            thatIcon.addClass('reversal');
            popover_html.find('.fa-thumb-tack').addClass('reversal');
            removeFilter(btn.data('filter'));
            btn.html(btn.text());
        }
        btn.data('bs.popover').options.content = popover_html[0].outerHTML;
    });
    btn_panel.delegate('.toolbar-disable-enable', 'click', function() {
        var thatIcon = $(this).children();
        var isDisabled = thatIcon.hasClass('fa-ban');
        var btn = $(this).closest('div.popover').prev();
        var filter = btn.data('filter');

        var popover_html = $(btn.data('bs.popover').options.content);

        if(isDisabled === true) {
            popover_html.find('.fa-ban').addClass('fa-circle-o').removeClass('fa-ban');
            thatIcon.removeClass('fa-ban');
            thatIcon.addClass('fa-circle-o');
            btn.removeClass('btn-danger disabled').addClass('btn-primary');
            filter.disable = false;
        }
        else {
            popover_html.find('.fa-circle-o').removeClass('fa-circle-o').addClass('fa-ban');
            thatIcon.addClass('fa-ban');
            thatIcon.removeClass('fa-circle-o');
            btn.addClass('btn-danger disabled').removeClass('btn-primary');
            filter.disable = true;
        }
        btn.data('bs.popover').options.content = popover_html[0].outerHTML;
        saveFilter(filter, true);
        //chart
        allChartRefresh();
        //table
        allTableDataRefresh();
    });
    btn_panel.delegate('.toolbar-trash', 'click', function() {
        var btn = $(this).closest('div.popover').prev('button');
        removeFilter(btn.data('filter'));
        btn.popover('hide');
        btn.remove();
        //chart
        allChartRefresh();
        //table
        allTableDataRefresh();
    });
    btn_panel.delegate('.toolbar-edit', 'click', function() {
        var btn = $(this).closest('div.popover').prev('button');
        var filterItem = btn.data('filter');
        $('#filter-category').val(filterItem.filter).trigger('change');
        $('#filter-operator').val(filterItem.oper).trigger('change');
        get_value_from_role(filterItem.filter, 'dom').val(filterItem.val).trigger('change');
        $('#filter-label').val(filterItem.label);

        $('#dialog-add-filter').modal('show').data('edit', btn[0]);
        $('#add-filter-title').text('Edit Filter');
        filter_apply = true;
        $('#shortcut-filter-trash').show();
    });
});
function get_value_from_role(id, type) {
    var role = '';
    var val = '';
    $('.filter-value-area').children('input,select').each(function() {
        role = this.getAttribute('data-role');
        if(role) {
            if(role.includes(id) === true) {
                if(type === 'dom') {
                    val = $(this);
                }
                else {
                    val = $(this).val();
                }
                return false;
            }
        }
    });
    return val;
}

function filter_save() {
    if(filter_apply === false) {
        alert('Can\'t create filter item! Please select other filter field.');
        return false;
    }
    var filter = $('#filter-category').val();
    var oper = $('#filter-operator').val();
    var val = get_value_from_role(filter);
    var label = $('#filter-label').val().trim();

    if(!filter) {
        alert('please select filter item!');
    }
    else if(!oper) {
        alert('please select operator!');
    }
    else if(val === '') {
        alert('please input filter value');
        get_value_from_role(filter, 'dom').focus();
    }
    else if(!label) {
        alert('please input filter label!');
        $('#filter-label').select();
    }
    else {
        if(filter === 'L7_PROTO_NAME' && !val) {
            alert('please select filter value!');
        }
        else {
            var filterData = {
                filter: filter,
                label: label,
                val: val,
                oper: oper,
                id: new Date().getTime().toString(16)
            };
            var existsBtn = $('#dialog-add-filter').data('edit');

            var btn_panel = $('#add-filter-panel');
            var btn = $('<button class="btn btn-primary filter-item">'+label+'</button>').appendTo(btn_panel);

            var reversal = true;
            if(existsBtn) {
                var old_filter = $(existsBtn).data('filter');
                if($(existsBtn).children().length) {
                    reversal = false;
                }
                filterData.id = old_filter.id;
                filterData.disable = old_filter.disable;
                $(existsBtn).replaceWith(btn);
                saveFilter(filterData, true);
            }
            else {
                btn_panel.append(btn);
            }
            if(filterData.disable == true) {
                btn.addClass('btn-danger disabled').removeClass('btn-primary');
            }
            else {
                btn.addClass('btn-primary');
            }
            if(reversal == false) {
                btn.html('<i class="fa fa-thumb-tack"></i> ' + filterData.label);
            }
            btn.popover({
                content: '<div class="btn-group">\n' +
                '            <button class="btn btn-primary toolbar-pin"><i class="fa fa-thumb-tack'+(reversal ? ' reversal' : '')+'"></i></button>\n' +
                '            <button class="btn btn-primary toolbar-disable-enable"><i class="fa '+(filterData.disable === true ? 'fa-ban' : 'fa-circle-o')+'"></i></button>\n' +
                '            <button class="btn btn-primary toolbar-trash"><i class="fa fa-trash"></i></button>\n' +
                '            <button class="btn btn-primary toolbar-edit"><i class="fa fa-edit"></i></button>\n' +
                '         </div>',
                placement: 'bottom',
                html: true
            });

            btn.data('filter', filterData);
            $('#dialog-add-filter').modal('hide');
        }
        //chart
        allChartRefresh();
        //table
        allTableDataRefresh();
    }
}

function open_new_filter() {
    $('#dialog-add-filter').removeData('edit');
    $('#filter-category').val('').trigger('change');
    $('#filter-operator').val('').trigger('change');
    $('.filter-value-area').children('input,span').val('').trigger('change').hide(0);
    $('#filter-label').val('');
    $('#dialog-add-filter').modal('show');$('#add-filter-title').text('Add Filter');
    $('#shortcut-filter-trash').hide();
}

function saveFilter(filter, update) {
    var filters = window.localStorage.getItem('filters');
    if(!filters) filters = {};
    else filters = JSON.parse(filters);
    if(update === true) {
        if(!filters[filter.id]) return false;
    }
    filters[filter.id] = filter;

    window.localStorage.setItem('filters', JSON.stringify(filters));
}
function removeFilter(filter) {
    var filters = JSON.parse(window.localStorage.getItem('filters'));
    var flag = false;
    $.each(filters, function(id) {
        if(id == filter.id) {
            flag = true;
            delete filters[id];
            return false;
        }
    });

    if(flag == true) {
        if($.isEmptyObject(filters) == false) {
            window.localStorage.setItem('filters', JSON.stringify(filters));
        }
        else {
            window.localStorage.removeItem('filters');
        }
    }
}

function shortcut_filter_trash() {
    var btn = $($('#dialog-add-filter').data('edit'));
    removeFilter(btn.data('filter'));
    btn.popover('hide');
    btn.remove();
    $('#dialog-add-filter').modal('hide');
}

function get_add_filter_format() {
    var filter_arr = {};
    $('#add-filter-panel').children('button').each(function() {
        var filter_data = $(this).data('filter');
        if(filter_data && filter_data.disable !== true) {
            filter_arr[filter_data.filter] = filter_data.val;
        }
    });
    if($.isEmptyObject(filter_arr) === false) {
        return JSON.stringify(filter_arr);
    }
    return '';
}