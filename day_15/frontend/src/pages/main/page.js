import {LOGIN_STATE} from './../../core';
import {choice} from './../../utils';
import {Content, Header} from './../../components';
import {BACKEND_URL} from './../../constants';


var WELCOME_MESSAGES = [
    'Isn\'t  it a great day?',
    'What a great Day!',
    'Good to see you again darling.',
    'The creature',
];

export function MainPage() {
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

    return (
        <>
            <Header clicked={ null } />
            <Content content={ content_element } />
        </>
    );
}

MainPage.propTypes = {};
