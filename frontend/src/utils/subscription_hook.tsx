import {useState as state_hook} from 'react';
import {useNavigate as get_navigator} from 'react-router-dom';


function placeholder_function(){}


export class Subscription {
    change_counter : number;
    set_change_counter : object;
    navigator: object;
    
    constructor(change_counter, set_change_counter, navigator) {
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

    get_subscriber_callback(api: null | string) {
        var callback;
        if (api === null) {
            callback = placeholder_function;
        } else {
            callback = () => this._subscribe(api);
        }

        return callback;
    }

    _subscribe(api: string) {
        api.subscribe(this);
        return () => this._unsubscribe(api);
    }

    _unsubscribe(api: string) {
        api.unsubscribe(this);
    }
}


export function create_subscription() {
    var [change_counter, set_change_counter] = state_hook(0);
    var navigator = get_navigator();

    return new Subscription(change_counter, set_change_counter, navigator);
}
