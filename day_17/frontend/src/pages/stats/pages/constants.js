import PropTypes from 'prop-types';

export var SUBMIT_SELL_DAILY_CUSTOM_ID = 'stats.sell_daily';

export var STATS_DATA_STRUCTURE = {
    'data': PropTypes.shape({
        'total_love': PropTypes.number,
        'streak': PropTypes.number,
    }).isRequired,
}
