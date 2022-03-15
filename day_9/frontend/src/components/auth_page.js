import {useNavigate as get_navigator} from 'react-router-dom';
import {createElement as create_element, Fragment, useEffect as use_effect} from 'react';

import {LOGIN_STATE} from './../login_state';
import {API_BASE_URL} from './../constants';
import {get_query} from './../hooks/get_query';
import {create_loader} from './loader';
import {create_content} from './content';


async function authorize(response, navigator) {
    var data = await response.json();

    localStorage.setItem('token', data['token']);
    localStorage.setItem('user', JSON.stringify(data['user']));
    localStorage.setItem('expires_at', data['expires_at']);

    LOGIN_STATE.try_load_from_locale_storage();
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


export function AuthPage(authorize, navigator) {
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

    return create_element(
        Fragment,
        null,
        create_element(
            'nav',
            {'className': 'header'},
            create_element(
                'div',
                {'className': 'middle'},
                title,
            ),
        ),
        create_content(create_loader()),
    )
}
