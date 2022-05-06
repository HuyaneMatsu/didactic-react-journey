import {User, AuthToken, to_string} from './core';
import dotenv from 'dotenv';

dotenv.config();

function get_env_or_raise(name: string): string {
    var value: undefined | string = process.env[name];
    if (value === undefined) {
        throw ['Missing env variable: ', name].join('');
    }
    return value;
}

export var CLIENT_ID: string = get_env_or_raise('CLIENT_ID');
export var CLIENT_SECRET: string = get_env_or_raise('CLIENT_SECRET');

export var FRONTEND_URL: string = 'http://127.0.0.1:3000';

export var FRONTEND_AUTHORIZATION_URL: string = FRONTEND_URL + '/auth';

export var AUTHORIZATION_URL: string = [
    'https://discordapp.com/oauth2/authorize',
    '?', 'client_id', '=', CLIENT_ID,
    '&', 'client_id', '=', FRONTEND_AUTHORIZATION_URL,
    '&', 'response_type', '=', 'code',
    '&', 'scope', '=', 'identify',
].join('');


export var AUTHORIZED_USER_ID_TO_USER: Record<string, User> = {};


export var TOKENS: Record<string, Array<AuthToken>> = {};


export var NOTIFICATION_NAMES: Set<string> = new Set();
NOTIFICATION_NAMES.add('daily');
NOTIFICATION_NAMES.add('proposal');
