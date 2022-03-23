import {useNavigate as get_navigator} from 'react-router-dom';
import {useEffect as use_effect} from 'react';

import {LOGIN_STATE} from './../../core';
import {API_BASE_URL} from './../../constants';
import {get_query} from './../../utils/get_query';
import {create_loading_page} from './../../components';


async function authorize(response, navigator) {
    var data = await response.json();

    localStorage.setItem('token', data['token']);
    localStorage.setItem('expires_at', data['expires_at']);

    LOGIN_STATE.try_load_from_locale_storage();
    LOGIN_STATE._update_user(data['user']);
    navigator('/');
}

function invoke_authorization(code, navigator) {
    if (code === undefined) {
        navigator('/');
    } else {
        fetch(
            API_BASE_URL + '/auth',
            {
                'method': 'POST',
                'headers': {'Content-Type': 'application/json'},
                'body': JSON.stringify({'code': code}),
            },
        ).then(
            response => authorize(response, navigator)
        )
    }
}


export function AuthPage() {
    var navigator = get_navigator();
    var query = get_query();

    var code = query.get('code');
    var title;

    use_effect(
        () => invoke_authorization(code, navigator),
        [code],
    );

    if (code === undefined) {
        title = 'Redirecting';

    } else {
        title = 'Authorizing | Redirecting'
    }

    return create_loading_page(title);
}

AuthPage.propTypes = {};
