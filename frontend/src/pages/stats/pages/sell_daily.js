import {useEffect as use_effect, useState as state_hook, createElement as create_element} from 'react';
import {Link, Navigate} from 'react-router-dom';

import {get_from_dict, get_handler, create_subscription} from './../../../utils';

import {STATS_DATA_STRUCTURE, SUBMIT_SELL_DAILY_CUSTOM_ID} from './constants';
import {create_submit_event_handler, create_change_handler_callback} from './callbacks';


export var TEST_ID_STATS_PAGE_SELL_DAILY_INPUT = 'stats_page.sell_daily_page.input';

export function StatsPageSellDaily({data}) {
    var subscription = create_subscription();
    var handler = get_handler(SUBMIT_SELL_DAILY_CUSTOM_ID);
    use_effect(subscription.get_subscriber_callback(handler), []);

    var streak = get_from_dict(data, 'streak', 0);

    if (streak <= 0) {
        return <Navigate to=".." />
    }

    var [input_value, set_input_value] = state_hook('');


    var submit_button_parameters = {};
    if (handler.is_set()) {
        submit_button_parameters['className'] = 'disabled';
    }

    var submit_event_handler = create_submit_event_handler(handler, input_value, subscription);

    var change_handler = create_change_handler_callback(handler, set_input_value, input_value, streak);


    return (
        <>
            <form onSubmit={ submit_event_handler }>
                <label>{ 'How much streak to sell?' }</label>
                <input
                    required={ true }
                    type="text"
                    value={ input_value }
                    onChange={ change_handler }
                    data-testid={ TEST_ID_STATS_PAGE_SELL_DAILY_INPUT }
                />
                <button {...submit_button_parameters} >
                    { 'Lets do it!' }
                </button>
            </form>

            <Link to="..">
                { 'Back to safety' }
            </Link>
       </>
    )
}

StatsPageSellDaily.propTypes = STATS_DATA_STRUCTURE;
