import {CLIENT_ID, CLIENT_SECRET} from './../constants';
import {OA2Access} from './oauth2_access';
import {DISCORD_ENDPOINT} from './constants';
import {build_form_data} from './helpers';
import {OA2AccessData, UserData} from './../structures';
import {User} from './user';
import {to_string} from './helpers';


export async function user_info_get(access: OA2Access): Promise<User> {
    var response = await fetch(
        DISCORD_ENDPOINT + '/users/@me',
        {
            'method': 'POST',
            'headers': {'Authorization': 'Bearer ' + access.access_token},
        },
    )

    if (response.status !== 200) {
        throw to_string(response);
    }

    var response_data: UserData = (await response.json()) as UserData;

    return new User(response_data, access);
}
