import {Link} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {BACKEND_URL} from './../../constants';


export var HEADER_LOGIN_TEST_ID = 'login_button';


export function LoginButton() {
    var element;

    var shared_attributes = {
        'className': 'login',
        'data-testid': HEADER_LOGIN_TEST_ID,
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

LoginButton.propTypes = {};
