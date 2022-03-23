import {Link} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {BACKEND_URL} from './../../constants';


export function LoginButton() {
    var element;

    if (LOGIN_STATE.is_logged_in) {
        element = (
            <Link className='login' to='/logoff'>
                <img src={ LOGIN_STATE.user.get_avatar_url_as(null, 32) }/>
                <p>{ LOGIN_STATE.user.get_full_name() }</p>
            </Link>
        );

    } else {
        element = (
            <a className='login' href={ BACKEND_URL + '/login' }>
                { 'Login' }
            </a>
        );
    }

    return element;
}

