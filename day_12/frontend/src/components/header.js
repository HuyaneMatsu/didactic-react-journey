import {Link} from 'react-router-dom';
import {createElement as create_element} from 'react';

import {LOGIN_STATE} from './../login_state';
import {BACKEND_URL} from './../constants';


function create_header_button(system_name, to, display_name, clicked) {
    var element_attributes = {};
    var element_type;

    if (LOGIN_STATE.is_logged_in) {
        if (system_name == clicked) {
            element_attributes['className'] = 'clicked';
            element_type = 'a'
        } else {
            element_attributes['to'] = to;
            element_type = Link;
        }

    } else {
        element_attributes['className'] = 'disabled';
        element_type = 'a'
    }

    return create_element(
        element_type,
        element_attributes,
        display_name,
    );
}

function create_login_button() {
    var element;

    if (LOGIN_STATE.is_logged_in) {
    element = (
        <Link className='login' to='/logoff'>
            <img src={ LOGIN_STATE.user.get_avatar_url_as(null, 32) }/>
            <p>{ LOGIN_STATE.user.get_full_name() }</p>
        </Link>
    )

    } else {
        element = (
            <a className='login' href={ BACKEND_URL + '/login' }>
                { 'Login' }
            </a>
        );
    }

    return element;
}


export function create_header(clicked) {
    return (
        <nav className='header'>
            <div className='left'>
                { create_header_button('profile', '/profile', 'Profile', clicked) }
                { create_header_button('stats', '/stats', 'Stats', clicked) }
                { create_header_button('notifications', '/notifications', 'Notifications', clicked) }
            </div>
            <div className='right'>
                { create_login_button() }
            </div>
        </nav>
    );
}
