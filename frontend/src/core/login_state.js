import {API_BASE_URL} from './../constants';
import {SubscriptionAPIBase} from './../utils';

import {User} from './entities';


export class LoginState  extends SubscriptionAPIBase {
    constructor() {
        super();
        this.set_default_attributes();
        this.try_load_from_locale_storage();
        this.maybe_login();
    }

    try_load_from_locale_storage() {
        var state_found, token, expires_at;

        while (1) {
            token = localStorage.getItem('token')
            expires_at = localStorage.getItem('expires_at');

            if (token === null) {
                state_found = false;
                break;
            }

            if (expires_at === null) {
                state_found = false;
                break;
            }

            try {
                expires_at = new Date(expires_at);
            } catch {
                state_found = false;
                break;
            }

            state_found = true;
            break;
        }

        if (! state_found) {
            token = null;
            expires_at = null
            this.clear_locale_storage();
        }

        var is_logged_in, was_logged_in;

        if (state_found) {
            if (expires_at < (new Date())) {
                was_logged_in = true;
                is_logged_in = false;
            } else {
                was_logged_in = false;
                is_logged_in = true;
            }
        } else {
            is_logged_in = false;
            was_logged_in = false;
        }

        this.user = null;
        this.token = token;
        this.was_logged_in = was_logged_in;
        this.is_logged_in = is_logged_in;
        this.un_authorized = false;
    }

    _update_user(data) {
        var user = this.user;
        if (user === null) {
            user = new User(data);
            this.user = user;
        } else {
            user._update_attributes(data)
        }
    }

    clear_locale_storage() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at');
    }

    set_default_attributes() {
        this.logging_in = false;
        this.user = null;
        this.token = null;
        this.was_logged_in = false;
        this.is_logged_in = false;
        this.un_authorized = false;
    }

    clear() {
        this.set_default_attributes();
        this.clear_locale_storage();
    }

    /* This method is used when testing to log in a random user */
    test_set_random() {
        this.logging_in = false;
        this.user = new User({
            'id': '420691337',
            'created_at': '2022-03-29T21:57:54.977000+00:00',
            'name': 'nue',
            'avatar_hash': '0',
            'avatar_type': 0,
            'discriminator': 0,
        });
        this.token = 'a.a.aa';
        this.was_logged_in = false;
        this.is_logged_in = true;
        this.un_authorized = false;
    }

    /* sets specific attributes of the login state */
    test_set_specific(keyword_parameters) {
        var logged_in = keyword_parameters['logged_in'];
        if (logged_in !== undefined) {
            this.logged_in = logged_in;
        }

        var user = keyword_parameters['user'];
        if (user !== undefined) {
            this.user = user;
        }

        var token = keyword_parameters['token'];
        if (token !== undefined) {
            this.token = token;
        }

        var was_logged_in = keyword_parameters['was_logged_in'];
        if (was_logged_in !== undefined) {
            this.was_logged_in = was_logged_in;
        }

        var is_logged_in = keyword_parameters['is_logged_in'];
        if (is_logged_in !== undefined) {
            this.is_logged_in = is_logged_in;
        }

        var un_authorized = keyword_parameters['un_authorized'];
        if (un_authorized !== undefined) {
            this.un_authorized = un_authorized;
        }

    }

    un_authorize() {
        LOGIN_STATE.was_logged_in = true;
        LOGIN_STATE.is_logged_in = false;
        LOGIN_STATE.un_authorized = true;
        this.user = null
        this.clear_locale_storage();
    }

    maybe_login() {
        if (window.location.pathname === '/path') {
            return;
        }

        var token = this.token;
        if (token === null) {
            return;
        }

        this.try_login();
    }

    try_login() {
        this.logging_in = true;
        fetch(
            API_BASE_URL + '/user/@me',
            {
                'headers': {
                    'Authorization': this.token,
                },
            },
        ).then(
            (request) => this._user_request_callback(request)
        );
    }

    async _user_request_callback(request) {
        var status = request.status;

        this.logging_in = false;
        if (status === 200) {
            var data = await request.json();

            this.un_authorized = false;
            this.is_logged_in = true;
            this._update_user(data)
        } else {
            if (status === 401) {
                this.un_authorize();
            }
        }

        this.display();
    }
}


export var LOGIN_STATE = new LoginState();
