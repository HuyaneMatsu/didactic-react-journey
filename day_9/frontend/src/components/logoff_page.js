import {createElement as create_element, Fragment} from 'react';
import {Navigate, useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../login_state';
import {create_header} from './header';
import {create_content} from './content';


function execute_logoff(navigator) {
    LOGIN_STATE.clear();
    navigator('/');
}

function cancel_logoff(navigator) {
    navigator('/');
}

export function LogoffPage() {
    var navigator = get_navigator();

    if (LOGIN_STATE.was_logged_in) {
        LOGIN_STATE.clear();
        return create_element(
            Navigate,
            {'to': '/', 'replace': true},
        );
    }

    var content_element = create_element(
        'div',
        {'className': 'welcome'},
        create_element(
            'div',
            {'className': 'user'},
            'Are you sure to logoff?',
        ),
        create_element(
            'div',
            {'className': 'message'},
            create_element(
                'a',
                {
                    'className': 'left',
                    'onClick': () => execute_logoff(navigator),
                },
                'Yeah',
            ),
            create_element(
                'a',
                {
                    'className': 'right',
                    'onClick': () => cancel_logoff(navigator),
                },
                'Nah',
            ),
        )
    );

    return create_element(
        Fragment,
        null,
        create_header(null),
        create_content(content_element),
    );
}
