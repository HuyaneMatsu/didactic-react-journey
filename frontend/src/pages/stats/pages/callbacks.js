import {int_field_validator, get_page_loader_api, set_handler} from './../../../utils';
import {API_BASE_URL} from './../../../constants';
import {LOGIN_STATE} from './../../../core';

export function create_submit_event_handler(handler, input_value, subscription) {
    var submit_event_handler;
    if (handler.is_set()) {
        submit_event_handler = (event) => submit_sell_daily_streak_placeholder_callback(event);
    } else {
        submit_event_handler = (event) => submit_sell_daily_streak_callback(event, input_value, handler, subscription);
    }
    return submit_event_handler;
}


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
            var page_loader_api = get_page_loader_api('/stats')
            page_loader_api.data = data;

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


export function create_change_handler_callback(handler, set_input_value, input_value, streak) {
    var change_handler;
    if (handler.is_set()) {
        change_handler = (event) => re_set_daily_streak(set_input_value, input_value);
    } else {
        change_handler = (event) => validate_and_re_set_daily_streak(event, set_input_value, input_value, streak);
    }
    return change_handler;
}

function validate_and_re_set_daily_streak(event, setter, default_value, max_value) {
    var value = event.target.value;
    value = int_field_validator(value, default_value, max_value);
    setter(value);
}

function re_set_daily_streak(setter, default_value) {
    setter(default_value);
}
