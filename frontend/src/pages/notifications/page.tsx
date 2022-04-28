import React, {useEffect as use_effect, ReactElement} from 'react';
import {create_subscription, get_handler, set_title, Subscription, RequestLifeCycleHandler} from './../../utils';
import {SpinningCircle, Page, ExceptionPageContent} from './../../components';
import {SaveNotificationsField} from './save_field';
import {NotificationOption} from './option';
import {NotificationData} from './../../structures';
import {NotificationHolder} from './types';
import {should_reload_notification_settings, request_notification_settings} from './loading';
import {ENDPOINT_NOTIFICATIONS} from './constants';

export function NotificationsPage(): ReactElement {
    var subscription: Subscription = create_subscription();
    var handler: RequestLifeCycleHandler = get_handler(ENDPOINT_NOTIFICATIONS);

    if (should_reload_notification_settings(handler)) {
        request_notification_settings(handler);
    }
    
    use_effect(subscription.get_subscriber_callback(handler), []);


    var data: null | NotificationData;
    var notification_holder: null | NotificationHolder = handler.get_result() as null | NotificationHolder;

    if (notification_holder === null) {
        data = null;
    } else {
        data = notification_holder.get_data();
    }


    var content_element: ReactElement;

    if (notification_holder === null) {
        content_element = <SpinningCircle />;

    } else if (notification_holder.errored_at) {
        content_element = (
            <ExceptionPageContent message={ notification_holder.exception_message } redirect_to={ '/' } />
        );

    } else if (data !== null) {
        content_element = (
            <div className="notifications">
                <div className="listing">
                    <NotificationOption
                        notification_holder={ notification_holder }
                        handler={ handler }
                        system_name={ 'daily' }
                        display_name={ 'Daily' }
                    />
                    <NotificationOption
                        notification_holder={ notification_holder }
                        handler={ handler }
                        system_name={ 'proposal' }
                        display_name={ 'Proposal' }
                    />
                </div>
                <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler } />

            </div>
        );

    } else {
        content_element = <SpinningCircle />;
    }

    set_title('notifications');

    return (
        <Page clicked={ 'notifications' } content={ content_element } />
    );
}
