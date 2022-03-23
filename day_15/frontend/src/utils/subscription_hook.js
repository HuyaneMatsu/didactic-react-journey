import {useState as state_hook} from 'react';
import {useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../core';
import {API_BASE_URL} from './../constants';
import {get_from_nullable_dict} from './helpers';


function placeholder_function(){}


export class LoaderAPISubscription {
    constructor(change_counter, set_change_counter, navigator) {
        this.change_counter = change_counter;
        this.set_change_counter = set_change_counter;
        this.navigator = navigator;
    }

    trigger(route) {
        var to_log;
        if (route === null) {
            to_log = `Triggered subscription update`;
        } else {
            to_log = `Triggered subscription update | Redirecting to ${route}`;
        }
        console.log(to_log);

        if (route !== null) {
            this.navigator(route);
        }
        /* When we call `set_change_counter` with a new value, react will reload the element */
        var change_counter = this.change_counter + 1;
        this.change_counter = change_counter;
        this.set_change_counter(change_counter);
    }

    get_subscriber_callback(api) {
        var callback;
        if (api === null) {
            callback = placeholder_function;
        } else {
            callback = () => this._subscribe(api);
        }

        return callback;
    }

    _subscribe(api) {
        api.subscribe(this);
        return () => this._unsubscribe(api);
    }

    _unsubscribe(api) {
        api.unsubscribe(this);
    }
}


export function create_subscription() {
    var [change_counter, set_change_counter] = state_hook(0);
    var navigator = get_navigator();

    return new LoaderAPISubscription(change_counter, set_change_counter, navigator);
}
