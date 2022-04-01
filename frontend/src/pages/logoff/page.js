import {Fragment} from 'react';
import {Navigate, useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {Page} from './../../components';

import {create_cancel_logoff_callback, create_execute_logoff_callback} from './callbacks';


export var TEST_ID_LOGOFF_PAGE = 'logoff_page';


export function LogoffPage() {
    var navigator = get_navigator();

    var content_element = (
        <div className="welcome">
            <div className="user">
                { 'Are you sure to logoff?' }
            </div>
            <div className="message">
                <a className="left" onClick={ create_execute_logoff_callback(navigator) }>
                    { 'Yeah' }
                </a>
                <a className="right" onClick={ create_cancel_logoff_callback(navigator) }>
                    { 'Nah' }
                </a>
            </div>

        </div>
    );

    return (
        <Page data-testid={TEST_ID_LOGOFF_PAGE} clicked={ null } content={ content_element } />
    );
}

LogoffPage.propTypes = {};
