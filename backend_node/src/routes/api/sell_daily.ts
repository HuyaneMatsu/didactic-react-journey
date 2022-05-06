import {Router, Request, Response} from 'express';
import {User} from './../../core';
import {get_user, get_stats_of} from './../../helpers';
import {StatsData} from './../../structures';


var router: Router = Router();
export var api_sell_daily_router: Router = router;


router.get(
    '/sell_daily',
    function user_me(request: Request, response: Response) {
        var user: User | null = get_user(request, response);
        if (user === null) {
            return;
        }

        var data = request.body;

        try {
            Object.keys(data);
        } catch {
            response.status(400);
            return;
        }

        var raw_amount: unknown = data['amount'];
        if (raw_amount === undefined) {
            response.status(400);
            return;
        }

        var real_amount: number;

        if (typeof raw_amount === 'string') {
            real_amount = +raw_amount;
            if (isNaN(NaN)) {
                response.status(400);
                return;
            }
        } else if (typeof raw_amount === 'number') {
            real_amount = Math.floor(raw_amount);
        } else {
            response.status(400);
            return;
        }

        var stats: StatsData = get_stats_of(user.id);

        var old_streak: number| undefined = stats['streak'];
        if (old_streak === undefined) {
            old_streak = 0;
        }

        var new_streak: number = old_streak - real_amount;

        if (new_streak < 0) {
            real_amount += new_streak;
            new_streak = 0;
        }

        var total_love: number | undefined = stats['total_love'];
        if (total_love === undefined) {
            total_love = 100 * real_amount;
        } else {
            total_love += 100 * real_amount;
        }

        stats['total_love'] = total_love;
        stats['streak'] = new_streak;

        response.json(stats);
    }
);
