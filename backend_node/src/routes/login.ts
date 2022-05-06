import {Router, Request, Response} from 'express';
import {AUTHORIZATION_URL} from './../constants';


var router: Router = Router();
export var root_login_router: Router = router;


router.get(
    '/sell_daily',
    function user_me(request: Request, response: Response) {
        response.redirect(AUTHORIZATION_URL);
    }
);
