import {to_string} from './helpers';
import {now_as_id, id_to_datetime} from './utils';


export class AuthToken {
    user_id: bigint;
    version: bigint;
    value: string;
    _cached : null | string;

    constructor(user_id: bigint, version: bigint, value: string) {
        this.user_id = user_id;
        this.version = version;
        this.value = value;
        this._cached = null;
    }

    toString(): string {
        var cached: null | string = this._cached;
        if (cached === null) {
            cached = this._stringify();
            this._cached = cached;
        }

        return cached;
    }

    _stringify(): string {
        var user_id_key: string = b64encode(to_string(this.user_id));
        var version_key: string = b64encode(to_string(this.version));
        var value_key: string = b64encode(this.value);
        return [user_id_key, '.', version_key, '.', value_key].join('');
    }

    get_created_at(): Date {
        return id_to_datetime(this.version);
    }
}


// There os no real binary string in js, so we will generate a normal one instead, jeez

var CHARACTERS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


function get_random_value(): string {
    var characters: Array<string> = [];
    for (var index = 0; index < 32; index += 1) {
        characters.push(CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)));
    }

    return characters.join('');
}


var b64decode: (value: string) => string = atob;
var b64encode: (value: string) => string = btoa;

export function new_auth_token(user_id: bigint): AuthToken {
    var version: bigint = now_as_id();
    var value: string = get_random_value();
    return new AuthToken(user_id, version, value);
}

export function auth_token_from_string(value: string): null | AuthToken {
    var token_parts: Array<string> = value.split('.');
    if (token_parts.length !== 3) {
        return null;
    }

    var user_id_key: string = token_parts[0];
    var version_key: string = token_parts[1];
    var value_key: string = token_parts[2];

    var value: string;
    try {
        value = b64decode(value_key);
    } catch {
        return null;
    }

    if (value.length !== 32) {
        return null;
    }

    var string_user_id: string;
    var string_version: string;

    try {
        string_user_id = b64decode(user_id_key);
        string_version = b64decode(version_key);
    } catch {
        return null;
    }

    var user_id: bigint;
    var version: bigint;

    try {
        user_id = BigInt(string_user_id);
        version = BigInt(string_version);
    } catch {
        return null;
    }

    return new AuthToken(user_id, version, value);
}


export function are_auth_tokens_equal(auth_token_1: AuthToken, auth_token_2: AuthToken): boolean {
    if (auth_token_1.user_id !== auth_token_2.user_id) {
        return false;
    }

    if (auth_token_1.version !== auth_token_2.version) {
        return false;
    }

    if (auth_token_1.value !== auth_token_2.value) {
        return false;
    }

    return true;
}
