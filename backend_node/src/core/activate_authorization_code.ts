import {CLIENT_ID, CLIENT_SECRET} from './../constants';
import {OA2Access} from './oauth2_access';
import {DISCORD_ENDPOINT} from './constants';
import {build_form_data} from './helpers';
import {OA2AccessData} from './../structures';


export async function activate_authorization_code(
    redirect_url: string, code: string, scopes: string
): Promise<null | OA2Access> {

    var request_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_url,
        'scope': scopes,
    }

    var response = await fetch(
        DISCORD_ENDPOINT + '/api/oauth2/token',
        {
            'method': 'POST',
            'headers': {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            'body': build_form_data(request_data),
        },
    )

    if (response.status !== 200) {
        return null;
    }

    var response_data: Record<string, any> = await response.json();
    if (response_data.length === 1) {
        return null
    }

    return new OA2Access(response_data as OA2AccessData, redirect_url);
}
