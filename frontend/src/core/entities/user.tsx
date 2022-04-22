import {to_string, left_fill, to_string_base_16} from './../../utils';
import {UserData} from './../../structures';
import {ICON_TYPE_NONE, ICON_TYPE_STATIC, DISCORD_CDN_ENDPOINT, DEFAULT_AVATAR_COUNT} from './constants';


export class User {
    id: bigint;
    created_at: Date;
    name!: string;
    avatar_hash!: bigint;
    avatar_type!: number;
    discriminator!: number;

    constructor(data: UserData) {
        this.id = BigInt(data['id']);
        this.created_at = new Date(data['created_at']);
        this._update_attributes(data);
    }

    _update_attributes(data: UserData): void {
        this.name = data['name'];
        this.avatar_hash = BigInt(data['avatar_hash']);
        this.avatar_type = data['avatar_type'];
        this.discriminator = data['discriminator'];
    }

    get_full_name(): string {
        return [
            this.name,
            '#',
            left_fill(to_string(this.discriminator), 4, '0'),
        ].join('');
    }

    get_avatar_url_as(ext: null | string, size: null | number): string {
        var icon_type = this.avatar_type;
        var end: string;
        var prefix: string;

        if (icon_type === ICON_TYPE_NONE) {
            return this.get_default_avatar_url();
        }

        if (size === null) {
            end = '';
        } else {
            end = '?size=' + to_string(size);
        }

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

    get_default_avatar_url(): string {
        var default_avatar_value: bigint = this.id % DEFAULT_AVATAR_COUNT;

        return [
            DISCORD_CDN_ENDPOINT,
            '/embed/avatars/',
            to_string(default_avatar_value),
            '.png',
        ].join('');
    }
}
