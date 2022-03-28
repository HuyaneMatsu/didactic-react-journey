import PropTypes from 'prop-types';

import {LoaderAPI} from './../../utils';

import {create_change_notification_option_callback} from './callbacks';


export function NotificationOption({loaded_page_api, system_name, display_name}) {
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
            <p>{ display_name }</p>
            <label className='switch'>
                <input
                    type='checkbox'
                    checked={ value }
                    onChange={ create_change_notification_option_callback(loaded_page_api, system_name) }
                />
                <span></span>
            </label>
        </div>
    );
}


NotificationOption.propTypes = {
    'loaded_page_api': PropTypes.instanceOf(LoaderAPI).isRequired,
    'system_name': PropTypes.string.isRequired,
    'display_name': PropTypes.string.isRequired,
}
