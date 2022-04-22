import React, {createElement as create_element, useEffect as use_effect, ReactElement} from 'react';
import {
    PageLoaderAPI, create_subscription, get_handler, create_enter_press_callback, Subscription, RequestLifeCycleHandler
} from './../../utils';
import {SaveNotificationFieldProps, Callback} from './../../structures';
import {create_save_notification_settings_callback, create_revert_changes_callback} from './callbacks';
import {NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER, NOTIFICATION_SAVE_CUSTOM_ID} from './constants';


export var TEST_ID_SAVE_NOTIFICATIONS_FIELD: string = 'notifications_page.save_field';


export function SaveNotificationsField({page_loader_api}: SaveNotificationFieldProps): ReactElement {
    var subscription: Subscription = create_subscription();
    var handler: RequestLifeCycleHandler = get_handler(NOTIFICATION_SAVE_CUSTOM_ID);
    var exception_message: string | null = NOTIFICATION_SAVE_EXCEPTION_MESSAGE_HOLDER.get();
    use_effect(subscription.get_subscriber_callback(handler), []);

    if (page_loader_api.data_changes === null) {
        return <></>;
    }

    var save_parameters: Record<string, any> = {'tabIndex' : '0'};
    var cancel_parameters: Record<string, any> = {'tabIndex' : '0'};

    if (handler.is_set()) {
        save_parameters['className'] = 'save_execute_disabled';
        cancel_parameters['className'] = 'save_cancel_disabled';
    } else {
        save_parameters['className'] = 'save_execute_enabled';
        cancel_parameters['className'] = 'save_cancel_enabled';

        var save_callback: Callback = create_save_notification_settings_callback(page_loader_api, handler);
        save_parameters['onClick'] = save_callback;
        save_parameters['onKeyPress'] = create_enter_press_callback(save_callback);

        var cancel_callback: Callback = create_revert_changes_callback(page_loader_api);
        cancel_parameters['onClick'] = cancel_callback;
        cancel_parameters['onKeyPress'] = create_enter_press_callback(cancel_callback);
    }

    var title_element: ReactElement | string;
    if (exception_message === null) {
        title_element = 'Remember to save your changes';
    } else {
        title_element = (
            <b>
                { 'Something went wrong |' + exception_message }
            </b>
        );
    }

    return (
        <div className='save' data-testid={ TEST_ID_SAVE_NOTIFICATIONS_FIELD }>
            <div className='left'>
                { title_element }
            </div>

            <div className='right'>
                { create_element('a', save_parameters, 'save') }
                { create_element('a', cancel_parameters, 'cancel') }
            </div>
        </div>

    );
}
