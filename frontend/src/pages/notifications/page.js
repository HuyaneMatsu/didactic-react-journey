import {useEffect as use_effect} from 'react';
import {create_subscription, get_page_loader_api} from './../../utils';
import {SpinningCircle, Page, ExceptionPageContent} from './../../components';
import {SaveNotificationsField} from './save_field';
import {NotificationOption} from './option';


export function NotificationsPage() {
    var subscription = create_subscription();
    var page_loader_api = get_page_loader_api('/notification_settings')

    use_effect(subscription.get_subscriber_callback(page_loader_api), [])

    var content_element;
    if (page_loader_api.errored_at) {
        content_element = (
            <ExceptionPageContent message={ page_loader_api.exception_message } redirect_to={ '/' } />
        );

    } else if (page_loader_api.is_loaded) {
        content_element = (
            <div className="notifications">
                <div className="listing">
                    <NotificationOption
                        page_loader_api={ page_loader_api }
                        system_name={ 'daily' }
                        display_name={ 'Daily' }
                    />
                    <NotificationOption
                        page_loader_api={ page_loader_api }
                        system_name={ 'proposal' }
                        display_name={ 'Proposal' }
                    />
                </div>
                <SaveNotificationsField page_loader_api={ page_loader_api } />

            </div>
        );
    } else {
        content_element = <SpinningCircle />;
    }

    return (
        <Page clicked={ 'notifications' } content={ content_element } />
    );
}

NotificationsPage.propTypes = {};
