import {Request, Response} from 'express';
import {User, auth_token_from_string, AuthToken} from './../core';
import {is_auth_token_like} from './tokens_functionality';
import {get_authorized_user} from './authorized_user_functionality';


export function get_user(request: Request, response: Response): null | User {
    var token: undefined | string = request.get('Authorization');
    if (token === undefined) {
        response.status(401);
        return null;
    }

    var auth_token: null | AuthToken = auth_token_from_string(token);
    if (auth_token === null) {
        response.status(401);
        return null;
    }

    if (! is_auth_token_like(auth_token)) {
        response.status(401);
        return null;
    }

    var user: null | User = get_authorized_user(auth_token.user_id);

    if (user === null) {
        response.status(401);
        return null;
    }

    return user;
}
