import {createElement as create_element, Fragment} from 'react';

import {LOGIN_STATE} from './../login_state';
import {choice} from './../utils';
import {create_header} from './header';
import {create_content} from './content';


var WELCOME_MESSAGES = [
    'Isn\'t  it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
];

export function IndexPage() {
    var content_element;

    if (LOGIN_STATE.is_logged_in || LOGIN_STATE.was_logged_in) {
        var welcome_text;
        if (LOGIN_STATE.un_authorized) {
            welcome_text = 'Something went wrong';
        } else {
            welcome_text = 'Welcome ' + LOGIN_STATE.user.name;
        }

        var notify_expired_login_element;

        if (LOGIN_STATE.is_logged_in) {
            notify_expired_login_element = choice(WELCOME_MESSAGES);
        } else {
            notify_expired_login_element = create_element(
                'a',
                {'className': 'login', 'href': '/login'},
                'Your session expired, please login',
            );
        }

        content_element = create_element(
            'div',
            {'className': 'welcome'},
            create_element(
                'div',
                {'className': 'user'},
                welcome_text,
            ),
            create_element(
                'div',
                {'className': 'message'},
                notify_expired_login_element,
            ),
        );
    } else {
        content_element = create_element(
        'div',
            {'className': 'login_reminder'},
            'Please log in first',
        );
    }

    return create_element(
        Fragment,
        null,
        create_header(null),
        create_content(content_element),
    );
}
