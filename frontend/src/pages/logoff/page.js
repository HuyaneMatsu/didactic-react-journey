import {Fragment} from 'react';
import {Navigate, useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../../core';
import {create_enter_press_callback, set_title} from './../../utils';
import {Page} from './../../components';

import {create_cancel_logoff_callback, create_execute_logoff_callback} from './callbacks';



export function LogoffPage() {
    var navigator = get_navigator();

    var execute_logoff_callback = create_execute_logoff_callback(navigator);
    var execute_logoff_key_callback = create_enter_press_callback(execute_logoff_callback);

    var cancel_logoff_callback = create_cancel_logoff_callback(navigator);
    var cancel_logoff_key_callback = create_enter_press_callback(cancel_logoff_callback);

    set_title('logoff');

    var content_element = (
        <div className="welcome">
            <div className="user">
                { 'Are you sure to logoff?' }
            </div>
            <div className="message">
                <a
                    className="left"
                    tabIndex={ 0 }
                    onClick={ execute_logoff_callback }
                    onKeyPress={ execute_logoff_key_callback }
                >
                    { 'Yeah' }
                </a>
                <a
                    className="right"
                    tabIndex={ 0 }
                    onClick={ cancel_logoff_callback }
                    onKeyPress={ cancel_logoff_key_callback }
                >
                    { 'Nah' }
                </a>
            </div>

        </div>
    );

    return (
        <Page clicked={ null } content={ content_element } />
    );
}

LogoffPage.propTypes = {};
