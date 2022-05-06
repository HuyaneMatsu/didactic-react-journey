import {Router, Request, Response} from 'express';
import {
    new_auth_token, AuthToken, to_string, datetime_to_timestamp
} from './../../core';
import {FRONTEND_AUTHORIZATION_URL} from './../../constants';
import {OA2Access, activate_authorization_code, User, user_info_get} from './../../core';
import {serialise_user, add_authorized_user, add_auth_token} from './../../helpers';


var router: Router = Router();
export var api_auth_router: Router = router;


router.post(
    '/auth',
    async function authenticate(request: Request, response: Response) {
        var data = request.body;

        try {
            Object.keys(data);
        } catch {
            response.status(400);
            return;
        }

        var raw_code: unknown;

        raw_code = data['code'];
        if ((raw_code === undefined) || (typeof raw_code !== 'string')) {
            response.status(400);
            return;
        }

        var code = raw_code as string;

        // activate auth token
        var access: null | OA2Access = await activate_authorization_code(FRONTEND_AUTHORIZATION_URL, code, 'identify');
        if (access === null) {
            response.status(400);
            return;
        }


        var user: User = await user_info_get(access);

        var user_id: bigint = user.id;
        var auth_token: AuthToken = new_auth_token(user_id);
        add_auth_token(user_id, auth_token);
        add_authorized_user(user_id, user);

        response.json({
            'token': to_string(auth_token),
            'user': serialise_user(user),
            'expires_at': datetime_to_timestamp(user.access.get_expires_at()),
        });


    }
);
