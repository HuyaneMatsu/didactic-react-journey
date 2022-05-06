import {User, to_string, datetime_to_timestamp} from './../core';
import {FrontendUserData} from './../structures';

export function serialise_user(user: User): FrontendUserData {
    return {
        'name': user.name,
        'id': to_string(user.id),
        'created_at': datetime_to_timestamp(user.get_created_at()),
        'avatar_hash': to_string(user.avatar_hash),
        'avatar_type': user.avatar_type,
        'discriminator': user.discriminator,
    };
}
