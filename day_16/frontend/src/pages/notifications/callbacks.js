import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';


export function create_change_notification_option_callback(loaded_page_api, system_name) {
    return (event) => change_notification_option(loaded_page_api, system_name, event);
}

function change_notification_option(loaded_page_api, system_name, event) {
    loaded_page_api.change_data(system_name, event.target.checked, true, true)
}


export function create_save_notification_settings_callback(loaded_page_api, set_is_saving) {
    return () => save_notification_settings(loaded_page_api, set_is_saving);
}

async function save_notification_settings(loaded_page_api, set_is_saving) {
    set_is_saving(true);
    var changes = loaded_page_api.copy_changes();
    var response = await fetch(
        API_BASE_URL + loaded_page_api.endpoint,
        {
            method: 'PATCH',
            headers: {
                'Authorization': LOGIN_STATE.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changes),
        },
    );
    set_is_saving(false);

    var response_status = response.status;
    if ((response_status >= 200) && (response_status < 400)) {
        loaded_page_api.apply_changes(changes, null, true);
    }
}

export function create_revert_changes_callback(loaded_page_api) {
    return () => loaded_page_api.revert_changes();
}
