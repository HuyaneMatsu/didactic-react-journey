import {
    ICON_TYPE_NONE, ICON_TYPE_STATIC, ICON_TYPE_ANIMATED, DISCORD_CDN_ENDPOINT, DEFAULT_AVATAR_COUNT, API_BASE_URL
} from './constants';
import {to_string, left_fill, to_string_base_16} from './utils';
import {SubscriptionBase} from './subscription_base';

class User {
    constructor(data) {
        this.id = BigInt(data['id']);
        this.created_at = new Date(data['created_at']);
        this._update_attributes(data);
    }

    _update_attributes(data) {
        this.name = data['name'];
        this.avatar_hash = BigInt(data['avatar_hash']);
        this.avatar_type = data['avatar_type'];
        this.discriminator = data['discriminator'];
    }

    get_full_name() {
        return [
            this.name,
            '#',
            left_fill(to_string(this.discriminator), 4, '0'),
        ].join('');
    }

    get_avatar_url_as(ext, size) {
        var icon_type = this.avatar_type;

        if (icon_type == ICON_TYPE_NONE) {
            return this.get_default_avatar_url();
        }

        var end;
        if (size === null) {
            end = '';
        } else {
            end = '?size=' + to_string(size);
        }

        var prefix;
        if (ext === null) {
            if (icon_type == ICON_TYPE_STATIC) {
                prefix = '';
                ext = 'png';
            } else {
                prefix = 'a_';
                ext = 'gif';
            }
        } else {
            if (icon_type == ICON_TYPE_STATIC) {
                prefix = '';
            } else {
                prefix = 'a_';
            }
        }

        return [
            DISCORD_CDN_ENDPOINT,
            '/avatars/',
            to_string(this.id),
            '/',
            prefix,
            left_fill(to_string_base_16(this.avatar_hash), 32, '0'),
            '.',
            ext,
            end,
        ].join('');
    }

    get_default_avatar_url() {
        var default_avatar_value = this.id % DEFAULT_AVATAR_COUNT;

        return [
            DISCORD_CDN_ENDPOINT,
            '/embed/avatars/',
            to_string(default_avatar_value),
            '.png',
        ].join('');
    }
}

class LoginState  extends SubscriptionBase{
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
        this.is_logged_in = state_found;
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
