import {createElement as create_element, useState as state_hook} from 'react';
import PropTypes from 'prop-types';

import {LoaderAPI} from './../../utils';

import {create_save_notification_settings_callback, create_revert_changes_callback} from './callbacks';


export function SaveNotificationsField({loaded_page_api}) {
    var [is_saving, set_is_saving] = state_hook(false);

    if (loaded_page_api.data_changes === null) {
        return '';
    }

    var save_parameters = {};
    var cancel_parameters = {};

    if (is_saving) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        save_parameters['onClick'] = create_save_notification_settings_callback(loaded_page_api, set_is_saving);
        cancel_parameters['onClick'] = create_revert_changes_callback(loaded_page_api);
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
