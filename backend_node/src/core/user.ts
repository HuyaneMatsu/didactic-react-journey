import {UserData} from './../structures';
import {to_string, left_fill, to_string_base_16} from './helpers';
import {id_to_datetime} from './utils';
import {DISCORD_CDN_ENDPOINT, DEFAULT_AVATAR_COUNT, ICON_TYPE} from './constants';
import {OA2Access} from './oauth2_access';


export class User {
    id: bigint;
    name!: string;
    avatar_hash!: bigint;
    avatar_type!: ICON_TYPE;
    banner_hash!: bigint;
    banner_type!: ICON_TYPE;
    discriminator!: number;
    banner_color!: null | number;
    access: OA2Access;

    constructor(data: UserData, access: OA2Access) {
        this.access = access;
        this.id = BigInt(data['id']);
        this._update_attributes(data);
    }

    _update_attributes(data: UserData): void {
        // set name

        var raw_name: undefined | string;
        var name: string;

        raw_name = data['username'];
        if (raw_name !== undefined) {
            name = raw_name;
        } else {
            raw_name = data['name'];
            if (raw_name === undefined) {
                name = '';
            } else {
                name = raw_name;
            }
        }

        this.name = name

        // set discriminator

        var raw_discriminator: undefined | string;
        var discriminator: number;

        raw_discriminator = data['discriminator'];
        if (raw_discriminator === undefined) {
            discriminator = 0;
        } else {
            discriminator = +raw_discriminator;
        }

        this.discriminator = discriminator;

        // set avatar

        var raw_avatar: undefined | null | string;
        var avatar_hash: bigint;
        var avatar_type: ICON_TYPE;

        raw_avatar = data['avatar'];
        if ((raw_avatar === undefined) || (raw_avatar === null)) {
            avatar_hash = BigInt(0);
            avatar_type = ICON_TYPE.NONE;
        } else {
            if (raw_avatar.startsWith('a_')) {
                avatar_type = ICON_TYPE.ANIMATED;
                raw_avatar = raw_avatar.slice(2);
            } else {
                avatar_type = ICON_TYPE.STATIC;
            }
            /* Do not look here pls, I hate js myself as well */
            avatar_hash = BigInt('0x' + raw_avatar);
        }

        this.avatar_hash = avatar_hash;
        this.avatar_type = avatar_type;

        // set banner

        var raw_banner: undefined | null | string;
        var banner_hash: bigint;
        var banner_type: ICON_TYPE;

        raw_banner = data['banner'];
        if ((raw_banner === undefined) || (raw_banner === null)) {
            banner_hash = BigInt(0);
            banner_type = ICON_TYPE.NONE;
        } else {
            if (raw_banner.startsWith('a_')) {
                banner_type = ICON_TYPE.ANIMATED;
                raw_banner = raw_banner.slice(2);
            } else {
                banner_type = ICON_TYPE.STATIC;
            }
            /* Do not look here pls, I hate js myself as well */
            banner_hash = BigInt('0x' + raw_banner);
        }

        this.banner_hash = banner_hash;
        this.banner_type = banner_type;

        // set banner color

        var raw_banner_color: undefined | null | number;
        var banner_color: null | number;

        raw_banner_color = data['accent_color'];
        if (raw_banner_color === undefined) {
            banner_color = null;
        } else {
            banner_color = raw_banner_color;
        }

        this.banner_color = banner_color;
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

        if (icon_type === ICON_TYPE.NONE) {
            return this.get_default_avatar_url();
        }

        if (size === null) {
            end = '';
        } else {
            end = '?size=' + to_string(size);
        }

        if (ext === null) {
            if (icon_type === ICON_TYPE.STATIC) {
                prefix = '';
                ext = 'png';
            } else {
                prefix = 'a_';
                ext = 'gif';
            }
        } else {
            if (icon_type === ICON_TYPE.STATIC) {
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

    get_created_at(): Date {
        return id_to_datetime(this.id);
    }
}
