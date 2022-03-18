import {useEffect as use_effect, useState as state_hook} from 'react';
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

function submit_sell_daily_streak(event, input_value) {
    event.preventDefault();

    fetch(
        API_BASE_URL + '/sell_daily',
        {
            method: 'PATCH',
            headers: {
                'Authorization': LOGIN_STATE.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'amount': input_value}),
        },
    )

    /* TODO */
}

export function StatsPageSellDaily({data}) {
    var streak = get_from_dict(data, 'streak', 0);

    if (streak <= 0) {
        return <Navigate to=".." />
    }

    var [input_value, set_input_value] = state_hook('')

    return (
        <>
            <form onSubmit={ (event) => submit_sell_daily_streak(event, input_value) }>
                <label>{ 'How much streak to sell?' } </label>
                <input
                    required={ true }
                    type="text"
                    value={ input_value }
                    onChange={
                        (event) => validate_and_re_set_daily_streak(event, set_input_value, input_value, streak)
                    }
                />
                <button>
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
