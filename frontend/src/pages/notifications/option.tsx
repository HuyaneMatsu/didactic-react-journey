import React, {ReactElement} from 'react';
import {create_change_notification_option_callback} from './callbacks';
import {NotificationOptionProps, NotificationData} from './../../structures';


export var TEST_ID_NOTIFICATION_OPTION: string = 'notification_page.option';

export function NotificationOption(
    {notification_holder, handler, system_name, display_name}: NotificationOptionProps,
): ReactElement {
    var data: null | NotificationData = notification_holder.get_data();
    var old_value: undefined | boolean;
    if (data === null) {
        old_value = undefined;
    } else {
        old_value = data[system_name];
    }
    if (old_value === undefined) {
        old_value = true;
    }

    var value: boolean;

    var data_changes: null | NotificationData = notification_holder.data_changes;
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

    var element_id: string = 'switch_' + system_name;

    return (
        <div>
            <p>{ display_name }</p>
            <label
                className='switch'
                htmlFor={ element_id }
            >
                <input
                    type='checkbox'
                    name={ display_name }
                    id={ element_id }
                    checked={ value }
                    onChange={ create_change_notification_option_callback(notification_holder, handler, system_name) }
                    data-testid={ TEST_ID_NOTIFICATION_OPTION }
                />
                <span></span>
            </label>
        </div>
    );
}
