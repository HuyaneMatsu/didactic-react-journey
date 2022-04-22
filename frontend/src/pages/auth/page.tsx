import React, {useEffect as use_effect, ReactElement} from 'react';
import {get_query} from './../../utils/get_query';
import {get_handler, create_subscription, set_title, Subscription, RequestLifeCycleHandler} from './../../utils';
import {LoadingPage, ExceptionPage} from './../../components';
import {create_authorization_callback} from './callbacks';
import {AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER} from './constants';
import {QueryType} from './../../structures';


export var AUTHORIZATION_CUSTOM_ID: string = 'authorization';


export function AuthPage(): ReactElement {
    var query: QueryType = get_query();
    var code: null | string = query.get('code');

    var exception_message: null | string = AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER.get();
    var subscription: Subscription = create_subscription();
    var handler: RequestLifeCycleHandler = get_handler(AUTHORIZATION_CUSTOM_ID);


    use_effect(subscription.get_subscriber_callback(handler), []);


    use_effect(
        create_authorization_callback(handler, code, exception_message),
        [code, exception_message],
    );

    set_title('authenticate');

    var page: ReactElement;
    if (exception_message === null) {
        var title: string;
        if (code === null) {
            title = 'Redirecting';

        } else {
            title = 'Authorizing | Redirecting';
        }

        page = <LoadingPage title={ title } />;
    } else {
        page = <ExceptionPage message={ exception_message } redirect_to={ '/' } />
    }

    return page;
}
