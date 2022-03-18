import {createElement as create_element, useState as state_hook, Fragment, useEffect as use_effect} from 'react';

import {LOGIN_STATE} from './../login_state';
import {API_BASE_URL} from './../constants';
import {get_loader_api_subscription} from './../hooks/subscription_hook';
import {create_loader} from './loader';
import {create_header} from './header';
import {create_content} from './content';
import {get_loader_api} from './../loader_api';

async function save_notification_settings(loader_api, set_is_saving) {
    set_is_saving(true);
    var changes = loader_api.copy_changes();
    var response = await fetch(
        API_BASE_URL + loader_api.endpoint,
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
        loader_api.apply_changes(changes, null, true);
    }
}


function change_notification_option(loader_api, option_system_name, event) {
    loader_api.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification(loader_api, system_name, name) {
    var old_value = loader_api.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = loader_api.data_changes;
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

    return (
        <div>
            <p> { name }</p>
            <label className='switch'>
                <input
                    type='checkbox'
                    checked={ value }
                    onChange={ (event) => change_notification_option(loader_api, system_name, event) }
                />
                <span></span>
            </label>
        </div>
    );
}


function SaveNotificationsField({loader_api}) {
    var [is_saving, set_is_saving] = state_hook(false);

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        save_parameters['onClick'] = () => save_notification_settings(loader_api, set_is_saving);
        cancel_parameters['onClick'] = () => loader_api.revert_changes();
    }

    return (
        <div className='save'>
            <div className='left'>
                { 'Remember to save your changes' }
            </div>

            <div className='right'>
                { create_element('a', save_parameters, 'save') }
                { create_element('a', cancel_parameters, 'cancel') }
            </div>
        </div>

    );
}


function maybe_create_notification_sync_element(loader_api) {
    if (loader_api.data_changes === null) {
        return '';
    }

    return (
        <SaveNotificationsField loader_api={ loader_api } />
    );
}


export function NotificationsPage() {
    var subscription = get_loader_api_subscription();
    var loader_api = get_loader_api('/notification_settings')

    use_effect(subscription.get_subscriber_callback(loader_api), [])

    var content_element;
    if (loader_api.is_loaded) {
        content_element = create_element(
            'div',
            {'className': 'notifications'},
            create_element(
                'div',
                {'className': 'listing'},
                render_notification(loader_api, 'daily', 'Daily'),
                render_notification(loader_api, 'proposal', 'Proposal'),
            ),
            maybe_create_notification_sync_element(loader_api),
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
