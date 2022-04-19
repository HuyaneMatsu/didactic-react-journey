import {SubscriptionAPIBase} from './subscription_base';
import {Subscription} from './subscription_hooks';

var HANDLERS = {};

export class RequestLifeCycleHandler extends SubscriptionAPIBase {
    custom_id : string;
    _set_count: int;

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

    unsubscribe(subscriber: Subscription) {
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


export function get_handler(custom_id: string) {
    var handler = HANDLERS[custom_id];
    if (handler === undefined) {
        handler = new RequestLifeCycleHandler(custom_id);
    }

    return handler;
};


export function set_handler(handler: RequestLifeCycleHandler, callback: object, subscription: Subscription) {
    handler.set();
    subscription.trigger(null);
    return callback(handler);
}
