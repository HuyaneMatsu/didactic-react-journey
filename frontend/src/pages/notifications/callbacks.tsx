import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';
import {build_exception_message_from_response, RequestLifeCycleHandler}  from './../../utils';
import {NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER} from './constants'
import {ChangeEvent} from 'react';
import {
    InputChangeEvent, InputChangeEventCallback, Callback, NotificationData
} from './../../structures';
import {NotificationHolder} from './types';
import {ENDPOINT_NOTIFICATIONS} from './constants';


export function create_change_notification_option_callback(
    notification_holder: NotificationHolder,
    handler: RequestLifeCycleHandler,
    system_name: keyof NotificationData
): InputChangeEventCallback {
    return (event: InputChangeEvent) => change_notification_option(notification_holder, system_name, event, handler);
}

function change_notification_option(
    notification_holder: NotificationHolder,
    system_name: keyof NotificationData,
    event: InputChangeEvent,
    handler: RequestLifeCycleHandler,
): void {
    notification_holder.change_data(system_name, event.target.checked, true);
    handler.display(null);
}


export function create_save_notification_settings_callback(
    notification_holder: NotificationHolder,
    handler: RequestLifeCycleHandler,
): Callback {
    return () => save_notification_settings(notification_holder, handler);
}


async function save_notification_settings(
    notification_holder: NotificationHolder, handler: RequestLifeCycleHandler
): Promise<void> {
    try {
        handler.set();

        var token: null | string = LOGIN_STATE.token;
        if (token === null) {
            LOGIN_STATE.un_authorize();
            NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER.clear();
        } else {
            var changes: null | NotificationData = notification_holder.copy_changes();
            var response: Response = await fetch(
                API_BASE_URL + ENDPOINT_NOTIFICATIONS,
                {
                    'method': 'PATCH',
                    'headers': {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(changes),
                },
            );

            var response_status: number = response.status;
            if ((response_status >= 200) && (response_status < 400)) {
                notification_holder.apply_changes(changes, null, true);
                NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER.clear();
            } else {
                NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER.set(build_exception_message_from_response(response));
            }
        }
    } finally {
        handler.exit();
        handler.display(null);
    }
}

function revert_changes(
    notification_holder: NotificationHolder,
    handler:RequestLifeCycleHandler,
): void {
    notification_holder.revert_changes();
    handler.display(null);
}

export function create_revert_changes_callback(
    notification_holder: NotificationHolder,
    handler: RequestLifeCycleHandler,
): Callback {
    return () => revert_changes(notification_holder, handler)
}
