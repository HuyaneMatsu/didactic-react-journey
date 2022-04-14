import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';
import {build_exception_message_from_response} from './../../utils';

import {AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER} from './constants';

export function create_authorization_callback(handler, code, exception_message) {
    return () => invoke_authorization(handler, code, exception_message);
}


async function authorize(handler, code, navigator) {
    var display_route = null;
    AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER.clear();

    try {
        if (code === null) {
            display_route = '/';
        } else {
            var response = await fetch(
                API_BASE_URL + '/auth',
                {
                    'method': 'POST',
                    'headers': {'Content-Type': 'application/json'},
                    'body': JSON.stringify({'code': code}),
                },
            )

            var status = response.status;

            if (status === 200) {
                var data = await response.json();

                localStorage.setItem('token', data['token']);
                localStorage.setItem('expires_at', data['expires_at']);

                LOGIN_STATE.try_load_from_locale_storage();
                LOGIN_STATE._update_user(data['user']);

                display_route = '/';

            } else {
                AUTHORIZATION_EXCEPTION_MESSAGE_HOLDER.set(build_exception_message_from_response(response))

            }
        }

    } finally {
        handler.exit();
        handler.display(display_route);
    }

}

function invoke_authorization(handler, code, exception_message) {
    if (exception_message === null) {
        authorize(handler, code);
    }
}
