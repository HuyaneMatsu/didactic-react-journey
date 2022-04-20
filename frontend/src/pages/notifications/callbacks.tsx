import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';
import {build_exception_message_from_response, PageLoaderAPI, RequestLifeCycleHandler}  from './../../utils';
import {NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER} from './constants'
import {ChangeEvent} from 'react';

export function create_change_notification_option_callback(
    page_loader_api: PageLoaderAPI, system_name: string
): (event: ChangeEvent<HTMLInputElement>) => void {
    return (event: ChangeEvent<HTMLInputElement>) => change_notification_option(page_loader_api, system_name, event);
}

function change_notification_option(
    page_loader_api: PageLoaderAPI, system_name: string, event: ChangeEvent<HTMLInputElement>
): void {
    page_loader_api.change_data(system_name, event.target.checked, true, true)
}


export function create_save_notification_settings_callback(
    page_loader_api: PageLoaderAPI,
    handler: RequestLifeCycleHandler,
): () => void {
    return () => save_notification_settings(page_loader_api, handler);
}


async function save_notification_settings(
    page_loader_api: PageLoaderAPI, handler: RequestLifeCycleHandler
): Promise<void> {
    try {
        var token: null | string = LOGIN_STATE.token;
        if (token === null) {
            LOGIN_STATE.un_authorize();
            NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER.clear();
        } else {
            var changes = page_loader_api.copy_changes();
            var response = await fetch(
                API_BASE_URL + page_loader_api.endpoint,
                {
                    'method': 'PATCH',
                    'headers': {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(changes),
                },
            );

            var response_status = response.status;
            if ((response_status >= 200) && (response_status < 400)) {
                page_loader_api.apply_changes(changes, null, true);
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

export function create_revert_changes_callback(page_loader_api: PageLoaderAPI): () => void {
    return () => page_loader_api.revert_changes();
}
