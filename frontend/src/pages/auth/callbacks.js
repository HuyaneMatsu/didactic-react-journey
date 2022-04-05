import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';

export function create_authorization_callback(code, navigator) {
    return () => invoke_authorization(code, navigator);
}

async function authorize(code, navigator) {
    if (code !== null) {
        var response = await fetch(
            API_BASE_URL + '/auth',
            {
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({'code': code}),
            },
        )

        var data = await response.json();

        localStorage.setItem('token', data['token']);
        localStorage.setItem('expires_at', data['expires_at']);

        LOGIN_STATE.try_load_from_locale_storage();
        LOGIN_STATE._update_user(data['user']);
    }

    navigator('/');
}

function invoke_authorization(code, navigator) {
    authorize(code, navigator);
}
