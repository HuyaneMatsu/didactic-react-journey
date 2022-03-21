import {useEffect as use_effect, useState as state_hook, createElement as create_element} from 'react';
import {Route, Routes, Link, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

import {LOGIN_STATE} from './../login_state';
import {get_loader_api_subscription} from './../hooks/subscription_hook';
import {create_header} from './header';
import {create_content} from './content';
import {create_loader} from './loader';
import {to_string, get_from_dict, int_field_validator} from './../utils';
import {get_loader_api} from './../loader_api';
import {API_BASE_URL} from './../constants';
import {get_handler, create_handler} from './../request_life_cycle_handler';


var STATS_DATA_STRUCTURE = {
    'data': PropTypes.shape({
        'total_love': PropTypes.number,
        'streak': PropTypes.number,
    }).isRequired,
}

export function StatsPageIndex({data}) {
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

function submit_sell_daily_streak_callback(event, input_value, subscription) {
    event.preventDefault();

    create_handler(
        SUBMIT_SELL_DAILY_CUSTOM_ID,
        (handler) => submit_sell_daily_streak(handler, input_value),
        subscription,
    )

async function submit_sell_daily_streak(handler, input_value)
    try {
        var response = await fetch(
            API_BASE_URL + '/sell_daily',
            {
                method: 'PATCH',
                headers: {
                    'Authorization': LOGIN_STATE.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'amount': input_value}),
            },
        );

        var status = response.status;
        if (status == 200) {
            data = await response.json();
            var loader_api = get_loader_api('/stats')
            loader_api.data = data;

        } else {
            if (status === 401) {
                LOGIN_STATE.un_authorize();
            }

        handler.display();

    } finally {
        handler.exit()
    }
}

export function StatsPageSellDaily({data}) {
    var subscription = get_loader_api_subscription();
    var handler = get_handler(SUBMIT_SELL_DAILY_CUSTOM_ID);
    use_effect(subscription.get_subscriber_callback(handler), [])

    var streak = get_from_dict(data, 'streak', 0);

    if (streak <= 0) {
        return <Navigate to=".." />
    }

    var [input_value, set_input_value] = state_hook('')


    var submit_button_parameters = {};
    if (handler !== null) {
        submit_button_parameters['className'] = 'disabled';
    }

    var submit_button = create_element(
        'button',
        submit_button_parameters,
        'Lets do it!',
    }

    var submit_event_handler;
    if (handler === null) {
        submit_event_handler = (event) => submit_sell_daily_streak_callback(event, input_value, subscription);
    } else {
        subMit_event_handler = null;
    }

    var change_handler;
    if (handler === null) {
        change_handler = (event) => validate_and_re_set_daily_streak(event, set_input_value, input_value, streak);
    } else {
        change_handler = (event) => re_set_daily_streak(set_input_value, input_value);
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
    var subscription = get_loader_api_subscription();
    var loader_api = get_loader_api('/stats')

    use_effect(subscription.get_subscriber_callback(loader_api), [])

    var content_element;
    if (loader_api.is_loaded) {
        var data = loader_api.data;

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
            { create_header('stats') }
            { create_content(content_element) }
        </>
    );
}

StatsPage.propTypes = {};
