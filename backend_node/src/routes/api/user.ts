import {Router, Request, Response} from 'express';
import {User} from './../../core';
import {get_user, serialise_user} from './../../helpers';


var router: Router = Router();
export var api_user_router: Router = router;


router.get(
    '/@me',
    function sell_daily(request: Request, response: Response) {
        var user: User | null = get_user(request, response);
        if (user === null) {
            return;
        }

        response.json(serialise_user(user));
    }
);
