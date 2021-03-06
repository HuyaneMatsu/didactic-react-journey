import {useState as state_hook} from 'react';
import {useNavigate as get_navigator} from 'react-router-dom';
import {SubscriptionAPIBase} from './subscription_base';
import {Navigator, NumberSetter, NumberHook} from './../structures';


function placeholder_function(){}


export class Subscription {
    change_counter : number;
    set_change_counter : NumberSetter;
    navigator: Navigator;
    
    constructor(
        change_counter: number,
        set_change_counter: NumberSetter,
        navigator: Navigator,
    ) {
        this.change_counter = change_counter;
        this.set_change_counter = set_change_counter;
        this.navigator = navigator;
    }

    trigger(route: null | string) {
        if (route !== null) {
            this.navigator(route);
        }
        /* When we call `set_change_counter` with a new value, react will reload the element */
        var change_counter = this.change_counter + 1;
        this.change_counter = change_counter;
        this.set_change_counter(change_counter);
    }

    get_subscriber_callback(api: null | SubscriptionAPIBase): () => void {
        var callback: () => void;
        if (api === null) {
            callback = placeholder_function;
        } else {
            callback = () => this._subscribe(api);
        }

        return callback;
    }

    _subscribe(api: SubscriptionAPIBase): () => void {
        api.subscribe(this);
        return () => this._unsubscribe(api);
    }

    _unsubscribe(api: SubscriptionAPIBase): void {
        api.unsubscribe(this);
    }
}


export function create_subscription(): Subscription {
    var navigator: Navigator = get_navigator();
    var [change_counter, set_change_counter]: NumberHook = state_hook(0);

    return new Subscription(change_counter, set_change_counter, navigator);
}
