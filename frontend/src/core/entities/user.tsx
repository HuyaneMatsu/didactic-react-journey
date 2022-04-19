import {to_string, left_fill, to_string_base_16} from './../../utils';

import {ICON_TYPE_NONE, ICON_TYPE_STATIC, DISCORD_CDN_ENDPOINT, DEFAULT_AVATAR_COUNT} from './constants';

interface UserData {
    id: string,
    created_at: string,
    name : string,
    avatar_hash: string,
    avatar_type: number,
    discriminator: number,
}

export class User {
    id: BigInt;
    created_at: Date;
    name: string;
    avatar_hash: BigInt;
    avatar_type: number;
    discriminator: number;

    constructor(data: UserData) {
        this.id = BigInt(data['id']);
        this.created_at = new Date(data['created_at']);
        this._update_attributes(data);
    }

    _update_attributes(data: UserData) {
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

    get_avatar_url_as(ext: null | string, size: null | number) {
        var icon_type = this.avatar_type;

        if (icon_type === ICON_TYPE_NONE) {
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
            if (icon_type === ICON_TYPE_STATIC) {
                prefix = '';
                ext = 'png';
            } else {
                prefix = 'a_';
                ext = 'gif';
            }
        } else {
            if (icon_type === ICON_TYPE_STATIC) {
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
