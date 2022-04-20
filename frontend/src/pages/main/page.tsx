import {LOGIN_STATE, User} from './../../core';
import {choice, set_title} from './../../utils';
import {Page} from './../../components';
import {BACKEND_URL} from './../../constants';
import {ReactElement} from 'react';
import React from 'react';

var WELCOME_MESSAGES = [
    'Isn\'t it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
];

export function MainPage(): ReactElement {
    var content_element: ReactElement | string;

    if (LOGIN_STATE.is_logged_in || LOGIN_STATE.was_logged_in) {
        var welcome_text: string;
        if (LOGIN_STATE.un_authorized) {
            welcome_text = 'Something went wrong';
        } else {
            var user = LOGIN_STATE.user as User;
            welcome_text = 'Welcome ' + user.name;
        }

        var notify_expired_login_element: ReactElement | string;

        if (LOGIN_STATE.is_logged_in) {
            notify_expired_login_element = choice(WELCOME_MESSAGES);
        } else {
            notify_expired_login_element = (
                <a className='login' href={ BACKEND_URL + '/login' }>
                    { 'Your session expired, please login' }
                </a>

            );
        }

        content_element = (
            <div className='welcome'>
                <div className='user'>
                    { welcome_text }
                </div>
                <div className='message'>
                    { notify_expired_login_element }
                </div>
            </div>
        );

    } else {
        content_element = (
            <div className='login_reminder'>
                { 'Please log in first' }
            </div>
        );
    }

    set_title(null);

    return (
        <Page clicked={ null } content={ content_element } />
    );
}
