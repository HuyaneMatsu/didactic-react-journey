import {SubscriptionBase} from './subscription_base';

var HANDLERS = {};

export class RequestLifeCycleHandler extends SubscriptionBase {
    constructor(custom_id) {
        super();
        this.custom_id = custom_id;
        this._set_count = 0;
        HANDLERS[custom_id] = this;
    }

    set() {
        this._set_count = this._set_count + 1;
    }

    is_set(){
        return (this._set_count !== 0);
    }

    exit() {
        this._set_count = this._set_count - 1;
        this._maybe_cleanup();
    }

    unsubscribe(subscriber) {
        super.unsubscribe(subscriber);
        this._maybe_cleanup();
    }

    _maybe_cleanup() {
        if ((this._set_count <= 0) && (this.subscribers.length === 0)) {
            var custom_id = this.custom_id;
            var maybe_self = HANDLERS[custom_id];
            if (maybe_self === this) {
                delete HANDLERS[custom_id];
            }
        }
    }
}


export function get_handler(custom_id) {
    var handler = HANDLERS[custom_id]
    if (handler === undefined) {
        handler = new RequestLifeCycleHandler(custom_id);
    }

    return handler;
};


export function set_handler(handler, callback, subscription) {
    handler.set();
    subscription.trigger(null);
    return callback(handler);
}
