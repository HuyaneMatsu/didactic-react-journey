import {
    int_field_validator, get_page_loader_api, set_handler, build_exception_message_from_response,
    RequestLifeCycleHandler, Subscription
} from './../../../utils';
import {API_BASE_URL} from './../../../constants';
import {LOGIN_STATE} from './../../../core';
import {SELL_DAILY_EXCEPTION_MESSAGE_HOLDER} from './constants';
import {ChangeEvent, FormEvent} from 'react';


export function create_submit_event_handler(
    handler: RequestLifeCycleHandler,
    input_value: string,
    subscription: Subscription
): (event: FormEvent<HTMLFormElement>) => void {
    var submit_event_handler: (event: FormEvent<HTMLFormElement>) => void;
    if (handler.is_set() || (input_value === '') || (input_value === '0')) {
        submit_event_handler = (
            (event: FormEvent<HTMLFormElement>) => submit_sell_daily_streak_placeholder_callback(event)
        )
    } else {
        submit_event_handler = (
            (
                event: FormEvent<HTMLFormElement>
            ) => (
                submit_sell_daily_streak_callback(event, input_value, handler, subscription)
            )
        )
    }
    return submit_event_handler;
}


function submit_sell_daily_streak_callback(
    event: FormEvent<HTMLFormElement>,
    input_value: string,
    handler: RequestLifeCycleHandler,
    subscription: Subscription,
): void {
    event.preventDefault();

    set_handler(
        handler,
        (handler) => submit_sell_daily_streak(handler, input_value),
        subscription,
    );
}

function submit_sell_daily_streak_placeholder_callback(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
}


async function submit_sell_daily_streak(handler: RequestLifeCycleHandler, input_value: string): Promise<void> {
    var display_route = null;

    try {
        var token: null | string = LOGIN_STATE.token;

        if (token === null) {
            LOGIN_STATE.un_authorize();
            display_route = '/';
            SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.clear();
        } else {
            var response = await fetch(
                API_BASE_URL + '/sell_daily',
                {
                    'method': 'POST',
                    'headers': {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({'amount': input_value}),
                },
            );

            var status = response.status;
            if (status === 200) {
                var data = await response.json();
                var page_loader_api = get_page_loader_api('/stats');
                page_loader_api.data = data;

                display_route = '/stats';
                SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.clear();

            } else if (status === 401) {
                LOGIN_STATE.un_authorize();
                display_route = '/';
                SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.clear();
            } else {
                SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.set(build_exception_message_from_response(response));
            }
        }
    } finally {
        handler.exit();
        handler.display(display_route);
    }
}


export function create_change_handler_callback(
    handler: RequestLifeCycleHandler,
    set_input_value: (value: string) => void,
    input_value: string,
    streak: number,
): (event: ChangeEvent<HTMLInputElement>) => void {
    var change_handler: (event: ChangeEvent<HTMLInputElement>) => void;
    if (handler.is_set()) {
        change_handler = (event: ChangeEvent<HTMLInputElement>) => re_set_daily_streak(set_input_value, input_value);
    } else {
        change_handler = (
            (
                event: ChangeEvent<HTMLInputElement>
            ) => (
                validate_and_re_set_daily_streak(event, set_input_value, input_value, streak)
            )
        );
    }
    return change_handler;
}

function validate_and_re_set_daily_streak(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void,
    default_value: string,
    max_value: number,
): void {
    var value: string = event.target.value;
    value = int_field_validator(value, default_value, max_value);
    setter(value);
}

function re_set_daily_streak(setter: (value: string) => void, default_value: string): void {
    setter(default_value);
}
