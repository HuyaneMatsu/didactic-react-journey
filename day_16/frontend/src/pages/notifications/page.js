import {Fragment, useEffect as use_effect} from 'react';

import {create_subscription, get_loaded_page_api} from './../../utils';
import {create_loader, Header, Content} from './../../components';

import {SaveNotificationsField} from './save_field';
import {NotificationOption} from './option';


export function NotificationsPage() {
    var subscription = create_subscription();
    var loaded_page_api = get_loaded_page_api('/notification_settings')

    use_effect(subscription.get_subscriber_callback(loaded_page_api), [])

    var content_element;
    if (loaded_page_api.is_loaded) {
        content_element = (
            <div className="notifications">
                <div className="listing">
                    <NotificationOption
                        loaded_page_api={ loaded_page_api }
                        system_name={ 'daily' }
                        display_name={ 'Daily' }
                    />
                    <NotificationOption
                        loaded_page_api={ loaded_page_api }
                        system_name={ 'proposal' }
                        display_name={ 'Proposal' }
                    />
                </div>
                <SaveNotificationsField loaded_page_api={ loaded_page_api } />

            </div>
        );
    } else {
        content_element = create_loader();
    }

    return (
        <>
            <Header clicked={ 'notifications' } />
            <Content content={ content_element } />
        </>

    );
}

NotificationsPage.propTypes = {};
