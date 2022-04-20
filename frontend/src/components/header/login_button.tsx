import {Link} from 'react-router-dom';
import {ReactElement} from 'react';
import {LOGIN_STATE, User} from './../../core';
import {BACKEND_URL} from './../../constants';
import React from 'react';


export var TEST_ID_HEADER_LOGIN: string = 'login_button';


export function LoginButton(): ReactElement {
    var element: ReactElement;

    var shared_attributes: Record<string, any> = {
        'className': 'login',
        'data-testid': TEST_ID_HEADER_LOGIN,
    };

    if (LOGIN_STATE.is_logged_in) {
        var user: User = LOGIN_STATE.user as User;

        element = (
            <Link to='/logoff' { ...shared_attributes }>
                <img alt="avatar" src={ user.get_avatar_url_as(null, 32) }/>
                <p>{ user.get_full_name() }</p>
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
