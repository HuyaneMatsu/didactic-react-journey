import {SubscriptionBase} from './subscription_base';

var HANDLERS = {};

export class RequestLifeCycleHandler extends SubscriptionBase {
    constructor(custom_id) {
        super();
        this.custom_id = custom_id;
        HANDLERS[custom_id] = this;
    }

    exit() {
        var custom_id = this.custom_id;
        var maybe_self = HANDLERS[custom_id];
        if (maybe_self === this) {
            delete HANDLERS[custom_id];
        }
    }
}


export function get_handler(custom_id) {
    var handler = HANDLERS[custom_id]
    if (handler === undefined) {
        handler = null;
    }

    return handler;
};


export function create_handler(custom_id, callback, subscription) {
    var handler = RequestLifeCycleHandler(custom_id);
    subscription.trigger();
    return callback(handler);
}
