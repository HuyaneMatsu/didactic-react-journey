import {
    ICON_TYPE_NONE, ICON_TYPE_STATIC, ICON_TYPE_ANIMATED, DISCORD_CDN_ENDPOINT, DEFAULT_AVATAR_COUNT
} from './constants';
import {to_string, left_fill, to_string_base_16} from './utils';

class User {
    constructor(data) {
        this.name = data['name'];
        this.id = BigInt(data['id']);
        this.avatar_hash = BigInt(data['avatar_hash']);
        this.avatar_type = data['avatar_type'];
        this.created_at = new Date(data['created_at']);
        this.discriminator = data['discriminator']
    }

    get_full_name() {
        return [
            this.name,
            '#',
            left_fill(to_string(this.discriminator), 4, '0')
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

        var prefix, ext;
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

 class LoginState {
    constructor(){
        var state_found, user, token, expires_at;

        while (1) {
            token = localStorage.getItem('token')
            if (token === null) {
                state_found = false;
                break;
            }

            var raw_user_data = localStorage.getItem('user');
            if (raw_user_data === null) {
                state_found = false;
                break;
            }

            var user_data;
            try {
                user_data = JSON.parse(raw_user_data);
            } catch {
                state_found = false;
                break;
            }

            user = new User(user_data);

            expires_at = localStorage.getItem('expires_at');
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
            user = null;
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

        this.user = user;
        this.token = token;
        this.was_logged_in = was_logged_in;
        this.is_logged_in = state_found;
        this.un_authorized = false;
    }

    clear_locale_storage() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expires_at');
    }

    clear() {
        this.user = null;
        this.token = null;
        this.was_logged_in = false;
        this.is_logged_in = false;
        this.un_authorized = false;
        this.clear_locale_storage();
    }

    un_authorize() {
        LOGIN_STATE.was_logged_in = true;
        LOGIN_STATE.is_logged_in = false;
        LOGIN_STATE.un_authorized = true;
        this.clear_locale_storage();
    }
}


export var LOGIN_STATE = new LoginState();
