function set_category_time_range(time_range_cate) {
    var tday = new Date();

    switch(time_range_cate) {
        case 'today':
            default_to = tday.getTime();
            tday.setHours(0, 0, 0, 0);
            default_from = tday.getTime();
            defaultInterval = '2m';
            break;

        case 'week':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            defaultInterval = '10h';
            break;

        case 'month':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            defaultInterval = '24h';
            break;

        case 'year':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            defaultInterval = '120h';
            break;

        case 'weekday':
            default_to = tday.getTime();
            var day = tday.getDay(),
                diff = tday.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
            default_from = (new Date(tday.setDate(diff))).getTime();
            defaultInterval = '24h';
            break;

        case 'monthday':
            default_to = tday.getTime();
            tday.setDate(1);
            default_from = tday.getTime();
            defaultInterval = '24h';
            break;

        case 'yearday':
            default_to = tday.getTime();
            tday.setMonth(0);
            tday.setDate(1);
            default_from = tday.getTime();
            defaultInterval = '24h';
            break;

        case '24h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (24 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '10m';
            break;

        case '12h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (12 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '5m';
            break;

        case '4h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (4 * 60 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '1m';
            break;

        case '1h':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '10s';
            break;

        case '15m':
            default_to = tday.getTime();
            default_from = new Date(default_to - (15 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '2s';
            break;
        case '30m':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 60 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '2s';
            break;

        case '7d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (7 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '5h';
            break;

        case '30d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '5h';
            break;
        case '60d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (60 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '5h';
            break;
        case '90d':
            default_to = tday.getTime();
            default_from = new Date(default_to - (90 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '24h';
            break;
        case '6mm':
            default_to = tday.getTime();
            default_from = new Date(default_to - (30 * 6 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '5h';
            break;

        case '1y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '240h';
            break;
        case '2y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (2 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '240h';
            break;
        case '5y':
            default_to = tday.getTime();
            default_from = new Date(default_to - (5 * 365 * 24 * 3600 * 1000));
            default_from = default_from.getTime();
            defaultInterval = '480h';
            break;
    }
}