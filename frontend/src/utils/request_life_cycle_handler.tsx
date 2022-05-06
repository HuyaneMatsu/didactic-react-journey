import {SubscriptionAPIBase} from './subscription_base';
import {Subscription} from './subscription_hook';


var HANDLERS: Record<string, RequestLifeCycleHandler> = {};


export class RequestLifeCycleHandler extends SubscriptionAPIBase {
    custom_id : string;
    _set_count: number;
    _result : null | unknown;

    constructor(custom_id: string) {
        super();
        this.custom_id = custom_id;
        this._set_count = 0;
        this._result = null;
        HANDLERS[custom_id] = this;
    }

    set(): void {
        this._set_count = this._set_count + 1;
    }

    get_result() {
        return this._result;
    }

    set_result(result: unknown) {
        this._result = result;
    }

    is_set(): boolean {
        return (this._set_count !== 0);
    }

    exit(): void {
        this._set_count = this._set_count - 1;
        this._maybe_cleanup();
    }

    unsubscribe(subscriber: Subscription): void {
        super.unsubscribe(subscriber);
        this._maybe_cleanup();
    }

    _maybe_cleanup(): void {
        if ((this._result === null) && (this._set_count <= 0) && (this.subscribers.length === 0)) {
            var custom_id = this.custom_id;
            var maybe_self = HANDLERS[custom_id];
            if (maybe_self === this) {
                delete HANDLERS[custom_id];
            }
        }
    }
}


export function get_handler(custom_id: string): RequestLifeCycleHandler {
    var handler = HANDLERS[custom_id];
    if (handler === undefined) {
        handler = new RequestLifeCycleHandler(custom_id);
    }

    return handler;
};


export function set_handler<CallbackReturnType>(
    handler: RequestLifeCycleHandler,
    callback: (handler: RequestLifeCycleHandler) => CallbackReturnType,
    subscription: Subscription,
): CallbackReturnType {
    subscription.trigger(null);
    return callback(handler);
}


export function clear_handlers(): void {
    for (var custom_id in HANDLERS) {
        delete HANDLERS[custom_id];
    }
}
