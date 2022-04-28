import {ENDPOINT_STATS} from './constants';
import {API_BASE_URL} from './../../constants';
import {StatHolder} from './types';
import {LOGIN_STATE} from './../../core';
import {build_exception_message_from_response, RequestLifeCycleHandler} from './../../utils';


export async function request_stats(handler: RequestLifeCycleHandler): Promise<void> {
    var holder: StatHolder = new StatHolder();
    handler.set_result(holder);

    var display_route: null | string = null;

    try {
        handler.set();

        var token: null | string = LOGIN_STATE.token;
        if (token === null) {
            return;
        }

        var response: Response = await fetch(
            API_BASE_URL + ENDPOINT_STATS,
            {
                'headers': {
                    'Authorization': token,
                },
            },
        );

        var status = response.status;
        if (status === 200) {
            var data = await response.json();

            holder.set_data(data);
            holder.clear_exception_message();
        } else {
            if (status === 401) {
                LOGIN_STATE.un_authorize();
                holder.clear_exception_message();

                /* `.display()` wont do anything, because it will run ur own element only, which wont redirect, */
                /* because redirect is checked one stack above it */

                display_route = '/';
            } else {
                holder.set_exception_message(build_exception_message_from_response(response));
            }
        }
    } finally {
        handler.exit();
        handler.display(display_route);
    }
}


export function should_reload_stats(handler: RequestLifeCycleHandler): boolean {
    var should_reload: boolean;
    if (handler.is_set()) {
        should_reload = false;
    } else {
        var holder: null | StatHolder= handler.get_result() as null | StatHolder;
        if (holder === null) {
            should_reload = true;
        } else {
            should_reload = false;
        }
    }
    return should_reload;
}
