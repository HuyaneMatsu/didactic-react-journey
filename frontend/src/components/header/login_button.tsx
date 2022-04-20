import {Link} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {BACKEND_URL} from './../../constants';


export var TEST_ID_HEADER_LOGIN = 'login_button';


export function LoginButton() {
    var element: object | string;

    var shared_attributes = {
        'className': 'login',
        'data-testid': TEST_ID_HEADER_LOGIN,
    };

    if (LOGIN_STATE.is_logged_in) {
        element = (
            <Link to='/logoff' { ...shared_attributes }>
                <img alt="avatar" src={ LOGIN_STATE.user.get_avatar_url_as(null, 32) }/>
                <p>{ LOGIN_STATE.user.get_full_name() }</p>
            </Link>
        );

    } else {
        element = (
            <a href={ BACKEND_URL + '/login' } { ...shared_attributes }>
                { 'Login' }
            </a>
        );
    }

    return element;
}
