import {useEffect as use_effect} from 'react';

import {get_query} from './../../utils/get_query';
import {get_handler, create_subscription} from './../../utils';
import {LoadingPage} from './../../components';

import {create_authorization_callback} from './callbacks';
import {AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER} from './constants';

var AUTHORIZATION_CUSTOM_ID = 'authorization';


export function AuthPage() {
    var query = get_query();

    var code = query.get('code');
    var exception_message = AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER.get();

    var title;

    var subscription = create_subscription();
    var handler = get_handler(AUTHORIZATION_CUSTOM_ID);


    use_effect(subscription.get_subscriber_callback(handler), []);


    use_effect(
        create_authorization_callback(handler, code, exception_message),
        [code, exception_message],
    );


    var page;
    if (exception_message === null) {
        if (code === null) {
            title = 'Redirecting';

        } else {
            title = 'Authorizing | Redirecting';
        }

        page = <LoadingPage title={ title } />;
    } else {

    }

    return page;
}

AuthPage.propTypes = {};
