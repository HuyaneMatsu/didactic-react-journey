import {PageLoaderAPI} from './../../utils';

import {create_change_notification_option_callback} from './callbacks';


export var TEST_ID_NOTIFICATION_OPTION = 'notification_page.option';

interface NotificationOptionProps {
    page_loader_api: PageLoaderAPI,
    system_name: string,
    display_name: string,
}

export function NotificationOption({page_loader_api, system_name, display_name}: NotificationOptionProps) {
    var old_value = page_loader_api.data[system_name];
    if (old_value === undefined) {
        old_value = true;
    }

    var value;

    var data_changes = page_loader_api.data_changes;
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

    var element_id = 'switch_' + system_name;

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
                    onChange={ create_change_notification_option_callback(page_loader_api, system_name) }
                    data-testid={ TEST_ID_NOTIFICATION_OPTION }
                />
                <span></span>
            </label>
        </div>
    );
}
