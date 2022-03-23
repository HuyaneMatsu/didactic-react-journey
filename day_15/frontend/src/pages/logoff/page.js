import {createElement as create_element, Fragment} from 'react';
import {Navigate, useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {Header, Content} from './../../components';


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
        return <Navigate replace={true} to="/" />
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

    return (
        <>
            <Header clicked={ null } />
            <Content content={ content_element } />
        </>
    );
}

LogoffPage.propTypes = {};
