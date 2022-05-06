import {TOKENS} from './../constants';
import {are_auth_tokens_equal, AuthToken, to_string} from './../core';


export function is_auth_token_like(auth_token: AuthToken): boolean {
    var string_user_id: string = to_string(auth_token.user_id);

    var auth_tokens: undefined | Array<AuthToken> = TOKENS[string_user_id];
    if (auth_tokens === undefined) {
        return false;
    }

    var auth_token_to_check: AuthToken;
    for (auth_token_to_check of auth_tokens) {
        if (are_auth_tokens_equal(auth_token, auth_token_to_check)) {
            return true;
        }
    }

    return false;
}

export function add_auth_token(user_id: bigint, auth_token: AuthToken): void {
    var string_user_id: string = to_string(auth_token.user_id);

    var auth_tokens: undefined | Array<AuthToken> = TOKENS[string_user_id];
    if (auth_tokens === undefined) {
        TOKENS[string_user_id] = [auth_token];
        return;
    }

    var auth_token_to_check: AuthToken;
    for (auth_token_to_check of auth_tokens) {
        if (are_auth_tokens_equal(auth_token, auth_token_to_check)) {
            return;
        }
    }
    auth_tokens.push(auth_token);
}
