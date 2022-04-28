import React, {useEffect as use_effect, useState as state_hook, ReactElement} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {
    StatsPageSellDailyProps, StringHook, FormSubmitEventCallback, InputChangeEventCallback
} from './../../../structures';
import {
    get_from_dict, get_handler, create_subscription, to_string, set_title, Subscription, RequestLifeCycleHandler
} from './../../../utils';
import {
    SUBMIT_SELL_DAILY_CUSTOM_ID, SELL_DAILY_EXCEPTION_MESSAGE_HOLDER, TEST_ID_STATS_PAGE_SELL_DAILY_INPUT,
    TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT, ELEMENT_ID_STATS_PAGE_SELL_DAILY_INPUT
} from './constants';
import {create_submit_event_handler_callback, create_change_handler_callback} from './callbacks';


export function StatsPageSellDaily({data, stat_holder}: StatsPageSellDailyProps): ReactElement {
    var subscription: Subscription = create_subscription();
    var handler: RequestLifeCycleHandler = get_handler(SUBMIT_SELL_DAILY_CUSTOM_ID);
    var exception_message: null | string = SELL_DAILY_EXCEPTION_MESSAGE_HOLDER.get();
    use_effect(subscription.get_subscriber_callback(handler), []);
    var [input_value, set_input_value]: StringHook = state_hook('');

    var streak: number = get_from_dict(data, 'streak', 0);

    if (streak <= 0) {
        return <Navigate to=".." />
    }


    /* Can happen after selling streak */
    if (parseInt(input_value) > streak) {
        input_value = to_string(streak);
    }

    var submit_button_parameters: Record<string, any> = {};
    if (handler.is_set()) {
        submit_button_parameters['className'] = 'disabled';
    }

    var submit_event_handler: FormSubmitEventCallback = create_submit_event_handler_callback(
        handler, input_value, subscription, stat_holder
    );

    var change_handler: InputChangeEventCallback = create_change_handler_callback(
        handler, set_input_value, input_value, streak
    );

    var notification: ReactElement | string;
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
                <label htmlFor={ ELEMENT_ID_STATS_PAGE_SELL_DAILY_INPUT }>
                    { 'How much streak to sell?' }
                </label>
                <input
                    id={ ELEMENT_ID_STATS_PAGE_SELL_DAILY_INPUT }
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
            <Link className="back" to="..">
                { 'Back to safety' }
            </Link>
       </>
    );
}
