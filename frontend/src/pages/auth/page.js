import {useEffect as use_effect} from 'react';

import {get_query} from './../../utils/get_query';
import {get_handler, create_subscription, set_title} from './../../utils';
import {LoadingPage, ExceptionPage} from './../../components';

import {create_authorization_callback} from './callbacks';
import {AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER} from './constants';

var AUTHORIZATION_CUSTOM_ID = 'authorization';


export function AuthPage() {
    var query = get_query();
    var code = query.get('code');
    var title;

    var exception_message = AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER.get();
    var subscription = create_subscription();
    var handler = get_handler(AUTHORIZATION_CUSTOM_ID);


    use_effect(subscription.get_subscriber_callback(handler), []);


    use_effect(
        create_authorization_callback(handler, code, exception_message),
        [code, exception_message],
    );

    set_title('authenticate');

    var page;
    if (exception_message === null) {
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

AuthPage.propTypes = {};
