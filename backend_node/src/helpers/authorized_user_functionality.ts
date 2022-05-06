import {User, to_string} from './../core';
import {AUTHORIZED_USER_ID_TO_USER} from './../constants';


export function get_authorized_user(user_id: bigint): null | User {
    var string_user_id: string = to_string(user_id);

    var user: undefined | User = AUTHORIZED_USER_ID_TO_USER[string_user_id];
    if (user === undefined) {
        return null;
    }
    return user;
}

export function add_authorized_user(user_id: bigint, user: User) {
    var string_user_id: string = to_string(user_id);

    AUTHORIZED_USER_ID_TO_USER[string_user_id] = user;
}
