import {createElement as create_element, useState as state_hook, Fragment} from 'react';

import {LOGIN_STATE} from './../login_state';
import {API_BASE_URL} from './../constants';
import {get_loader_hook} from './../hooks/loader_hook';
import {create_loader} from './loader';
import {create_header} from './header';
import {create_content} from './content';


async function save_notification_settings(loader_hook, set_is_saving) {
    set_is_saving(true);
    var changes = loader_hook.copy_changes();
    var response = await fetch(
        API_BASE_URL + loader_hook.endpoint,
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
        loader_hook.apply_changes(changes, null, true);
    }
}


function change_notification_option(loader_hook, option_system_name, event) {
    loader_hook.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification(loader_hook, system_name, name) {
    var old_value = loader_hook.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = loader_hook.data_changes;
    if (data_changes === null) {
        value = old_value;
    } else {
        var new_value = data_changes[system_name];
        if (new_value === undefined) {
            value = old_value;
        } else {
            value = new_value;
        }
    }

    return create_element(
        'div',
        null,
        create_element(
            'p',
            null,
            name,
        ),
        create_element(
            'label',
            {'className': 'switch'},
            create_element(
                'input',
                {
                    'type': 'checkbox',
                    'checked': value,
                    'onChange': (event) => change_notification_option(loader_hook, system_name, event),
                },
            ),
            create_element(
                'span',
                null,
            ),
        ),
    );
}


function SaveNotificationsField({loader_hook}) {
    var [is_saving, set_is_saving] = state_hook(false);

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        save_parameters['onClick'] = () => save_notification_settings(loader_hook, set_is_saving);
        cancel_parameters['onClick'] = () => loader_hook.revert_changes();
    }

    return create_element(
        'div',
        {'className': 'save'},
        create_element(
            'div',
            {'className': 'left'},
            'Remember to save your changes',
        ),
        create_element(
            'div',
            {'className': 'right'},
            create_element(
                'a',
                save_parameters,
                'save',
            ),
            create_element(
                'a',
                cancel_parameters,
                'cancel',
            ),
        ),
    )
}


function maybe_create_notification_sync_element(loader_hook) {
    if (loader_hook.data_changes === null) {
        return '';
    }

    return create_element(
        SaveNotificationsField,
        {'loader_hook': loader_hook},
    )
}


export function NotificationsPage() {
    var loader_hook = get_loader_hook('/notification_settings')
    var content_element;

    if (loader_hook.is_loaded) {
        content_element = create_element(
            'div',
            {'className': 'notifications'},
            create_element(
                'div',
                {'className': 'listing'},
                render_notification(loader_hook, 'daily', 'Daily'),
                render_notification(loader_hook, 'proposal', 'Proposal'),
            ),
            maybe_create_notification_sync_element(loader_hook),
        )
    } else {
        content_element = create_loader();
    }

    return create_element(
        Fragment,
        null,
        create_header('notifications'),
        create_content(content_element),
    )
}
