import {useEffect as use_effect, useState as state_hook, createElement as create_element} from 'react';
import {Route, Routes, Link, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

import {LOGIN_STATE} from './../../core';
import {Header, create_content, create_loader} from './../../components';
import {
    to_string, get_from_dict, int_field_validator, get_loaded_page_api, get_handler, set_handler, create_subscription
} from './../../utils';
import {API_BASE_URL} from './../../constants';


var STATS_DATA_STRUCTURE = {
    'data': PropTypes.shape({
        'total_love': PropTypes.number,
        'streak': PropTypes.number,
    }).isRequired,
}

function StatsPageIndex({data}) {
    var streak = get_from_dict(data, 'streak', 0);

    var sell_streak_element;
    if (streak > 0) {
        sell_streak_element = (
            <Link className='hey_mister' to='./sell_streak'>
                { 'Hey mister! Want your sell your streak?' }
            </Link>
        );
    } else {
        sell_streak_element = '';
    }
    
    return (
        <>
            <p>
                Hearts {to_string(get_from_dict(data, 'total_love', 0))}
            </p>
            <p>
                Streak {to_string(streak)}
            </p>
            { sell_streak_element }
        </>
    );
}

StatsPageIndex.propTypes = STATS_DATA_STRUCTURE;

function validate_and_re_set_daily_streak(event, setter, default_value, max_value) {
    var value = event.target.value;
    value = int_field_validator(value, default_value, max_value);
    setter(value);
}

function re_set_daily_streak(setter, default_value) {
    setter(default_value);
}


var SUBMIT_SELL_DAILY_CUSTOM_ID = 'stats.sell_daily';

function submit_sell_daily_streak_callback(event, input_value, handler, subscription) {
    event.preventDefault();

    set_handler(
        handler,
        (handler) => submit_sell_daily_streak(handler, input_value),
        subscription,
    );
}

function submit_sell_daily_streak_placeholder_callback(event) {
    event.preventDefault();
}


async function submit_sell_daily_streak(handler, input_value) {
    var display_route = null;

    try {
        var response = await fetch(
            API_BASE_URL + '/sell_daily',
            {
                method: 'POST',
                headers: {
                    'Authorization': LOGIN_STATE.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'amount': input_value}),
            },
        );

        var status = response.status;
        if (status === 200) {
            var data = await response.json();
            var loaded_page_api = get_loaded_page_api('/stats')
            loaded_page_api.data = data;

            display_route = '/stats';

        } else {
            if (status === 401) {
                LOGIN_STATE.un_authorize();
                display_route = '/';
            }
        }

    } finally {
        handler.exit();
        handler.display(display_route);
    }
}


function StatsPageSellDaily({data}) {
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

    var submit_button = create_element(
        'button',
        submit_button_parameters,
        'Lets do it!',
    );

    var submit_event_handler;
    if (handler.is_set()) {
        submit_event_handler = (event) => submit_sell_daily_streak_placeholder_callback(event);
    } else {
        submit_event_handler = (event) => submit_sell_daily_streak_callback(event, input_value, handler, subscription);
    }

    var change_handler;
    if (handler.is_set()) {
        change_handler = (event) => re_set_daily_streak(set_input_value, input_value);
    } else {
        change_handler = (event) => validate_and_re_set_daily_streak(event, set_input_value, input_value, streak);
    }

    return (
        <>
            <form onSubmit={ submit_event_handler }>
                <label>{ 'How much streak to sell?' } </label>
                <input
                    required={ true }
                    type="text"
                    value={ input_value }
                    onChange={ change_handler }
                />
                { submit_button }
            </form>

            <Link to="..">
                { 'Back to safety' }
            </Link>
       </>
    )
}

StatsPageSellDaily.propTypes = STATS_DATA_STRUCTURE;


export function StatsPage() {
    var subscription = create_subscription();
    var loaded_page_api = get_loaded_page_api('/stats')

    use_effect(subscription.get_subscriber_callback(loaded_page_api), [])

    var content_element;
    if (loaded_page_api.is_loaded) {
        var data = loaded_page_api.data;

        content_element = (
            <div className="stats">
                <Routes>
                    <Route path='/' element={ <StatsPageIndex data={data} /> }/>
                    <Route path='/sell_streak' element={<StatsPageSellDaily data={data} /> }/>
                </Routes>
            </div>
        );
    } else {
        content_element = create_loader();
    }

    return (
        <>
            <Header clicked={'stats'} />
            { create_content(content_element) }
        </>
    );
}

StatsPage.propTypes = {};
