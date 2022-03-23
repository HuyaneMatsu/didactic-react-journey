import {createElement as create_element, useState as state_hook, Fragment, useEffect as use_effect} from 'react';
import PropTypes from 'prop-types';

import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';
import {create_subscription, get_loaded_page_api, LoaderAPI} from './../../utils';
import {create_loader, Header, create_content} from './../../components';


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


function change_notification_option(loaded_page_api, option_system_name, event) {
    loaded_page_api.change_data(option_system_name, event.target.checked, true, true)
}

function render_notification(loaded_page_api, system_name, name) {
    var old_value = loaded_page_api.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = loaded_page_api.data_changes;
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
                    onChange={ (event) => change_notification_option(loaded_page_api, system_name, event) }
                />
                <span></span>
            </label>
        </div>
    );
}


function SaveNotificationsField({loaded_page_api}) {
    var [is_saving, set_is_saving] = state_hook(false);

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        save_parameters['onClick'] = () => save_notification_settings(loaded_page_api, set_is_saving);
        cancel_parameters['onClick'] = () => loaded_page_api.revert_changes();
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

SaveNotificationsField.propTypes = {
    'loaded_page_api': PropTypes.instanceOf(LoaderAPI).isRequired,
}


function maybe_create_notification_sync_element(loaded_page_api) {
    if (loaded_page_api.data_changes === null) {
        return '';
    }

    return (
        <SaveNotificationsField loaded_page_api={ loaded_page_api } />
    );
}


export function NotificationsPage() {
    var subscription = create_subscription();
    var loaded_page_api = get_loaded_page_api('/notification_settings')

    use_effect(subscription.get_subscriber_callback(loaded_page_api), [])

    var content_element;
    if (loaded_page_api.is_loaded) {
        content_element = create_element(
            'div',
            {'className': 'notifications'},
            create_element(
                'div',
                {'className': 'listing'},
                render_notification(loaded_page_api, 'daily', 'Daily'),
                render_notification(loaded_page_api, 'proposal', 'Proposal'),
            ),
            maybe_create_notification_sync_element(loaded_page_api),
        )
    } else {
        content_element = create_loader();
    }

    return (
        <>
            <Header clicked={ 'notifications' } />
            { create_content(content_element) }
        </>

    );
}

NotificationsPage.propTypes = {};
