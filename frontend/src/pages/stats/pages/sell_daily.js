import {useEffect as use_effect, useState as state_hook} from 'react';
import {Link, Navigate} from 'react-router-dom';

import {get_from_dict, get_handler, create_subscription, to_string, set_title} from './../../../utils';

import {STATS_DATA_STRUCTURE, SUBMIT_SELL_DAILY_CUSTOM_ID, SELL_DAILY_EXCEPTION_MESSAGE_HOLDER} from './constants';
import {create_submit_event_handler, create_change_handler_callback} from './callbacks';


export var TEST_ID_STATS_PAGE_SELL_DAILY_INPUT = 'stats_page.sell_daily_page.input';
export var TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT = 'stats_page.sell_daily_page.submit';

var ID_STATS_PAGE_SELL_DAILY_INPUT = 'sell_daily';


export function StatsPageSellDaily({data}) {
    var subscription = create_subscription();
    var handler = get_handler(SUBMIT_SELL_DAILY_CUSTOM_ID);
    var exception_message = SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.get();
    use_effect(subscription.get_subscriber_callback(handler), []);

    var streak = get_from_dict(data, 'streak', 0);

    if (streak <= 0) {
        return <Navigate to=".." />
    }

    var [input_value, set_input_value] = state_hook('');

    /* Can happen after selling streak */
    if (parseInt(input_value) > streak) {
        input_value = to_string(streak);
    }

    var submit_button_parameters = {};
    if (handler.is_set()) {
        submit_button_parameters['className'] = 'disabled';
    }

    var submit_event_handler = create_submit_event_handler(handler, input_value, subscription);

    var change_handler = create_change_handler_callback(handler, set_input_value, input_value, streak);

    var notification;
    if (exception_message === null) {
        notification = '';
    } else {
        notification = (
            <b>
                'Something went wrong | ' + exception_message
            </b>
        );
    }

    set_title('sell daily');

    return (
        <>
            <form onSubmit={ submit_event_handler }>
                <label htmlFor={ ID_STATS_PAGE_SELL_DAILY_INPUT }>
                    { 'How much streak to sell?' }
                </label>
                <input
                    id={ ID_STATS_PAGE_SELL_DAILY_INPUT }
                    name="How much daily to sell?"
                    required={ true }
                    type="text"
                    value={ input_value }
                    onChange={ change_handler }
                    data-testid={ TEST_ID_STATS_PAGE_SELL_DAILY_INPUT }
                />
                <button {...submit_button_parameters} data-testid={ TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT} >
                    { 'Lets do it!' }
                </button>
            </form>
            { notification }
            <Link to="..">
                { 'Back to safety' }
            </Link>
       </>
    );
}

StatsPageSellDaily.propTypes = STATS_DATA_STRUCTURE;
