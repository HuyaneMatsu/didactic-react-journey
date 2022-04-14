import PropTypes from 'prop-types';
import {ExceptionMessageHolder} from './../../../utils';

export var SUBMIT_SELL_DAILY_CUSTOM_ID = 'stats.sell_daily';

export var STATS_DATA_STRUCTURE = {
    'data': PropTypes.shape({
        'total_love': PropTypes.number,
        'streak': PropTypes.number,
    }).isRequired,
}

export var SELL_DAILY_EXCEPTION_MESSAGE_HOLDER = new ExceptionMessageHolder();
