import {Router, Response, Request} from 'express';
import {User} from './../../core';
import {get_user, get_stats_of} from './../../helpers';


var router: Router = Router();
export var api_stats_router: Router = router;


router.get(
    '/stats',
    function stats_get(request: Request, response: Response) {
        var user: User | null = get_user(request, response);
        if (user === null) {
            return;
        }
        response.json(get_stats_of(user.id));
    }
);
