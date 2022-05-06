import {Request, Response, Router} from 'express';
import {User, iter_dict_items} from './../../core';
import {get_user, get_notification_settings_of, set_notification_settings_of} from './../../helpers';
import {NOTIFICATION_NAMES} from './../../constants';
import {NotificationData} from './../../structures';


var router: Router = Router();
export var api_notification_settings_router: Router = router;


router.get(
    '/notification_settings',
    function notification_settings_get(request: Request, response: Response) {
        var user: User | null = get_user(request, response);
        if (user === null) {
            return;
        }
        response.json(get_notification_settings_of(user.id));
    }
);


router.patch(
    '/notification_settings',
    function notification_settings_patch(request, response) {
        var user: User | null = get_user(request, response);
        if (user === null) {
            return;
        }

        var data = request.body;

        var keys: Array<string>;
        var data_key: string;

        try {
            keys = Object.keys(data);
        } catch {
            response.status(400);
            return;
        }

        for (data_key of keys) {
            if (! NOTIFICATION_NAMES.has(data_key)) {
                response.status(400);
                return;
            }
        }

        var data_value: unknown;

        for (data_key of keys) {
            data_value = data[data_key];
            if (typeof value !== 'boolean') {
                response.status(400);
                return;
            }
        }

        var value: NotificationData[keyof NotificationData];
        var key: keyof NotificationData;

        var notification_settings: NotificationData = get_notification_settings_of(user.id);

        for ([key, value] of iter_dict_items<NotificationData>(data)) {
            if (value) {
                delete notification_settings[key];
            } else {
                notification_settings[key] = false;
            }
        }

        set_notification_settings_of(user.id, notification_settings)

        response.status(204);
        return
    }
);
