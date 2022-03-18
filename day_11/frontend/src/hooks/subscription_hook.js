import {useState as state_hook} from 'react';
import {useNavigate as get_navigator} from 'react-router-dom';

import {LOGIN_STATE} from './../login_state';
import {API_BASE_URL} from './../constants';
import {get_from_nullable_dict} from './../utils';


class LoaderAPISubscription {
    constructor(change_counter, set_change_counter, navigator) {
        this.change_counter = change_counter;
        this.set_change_counter = set_change_counter;
        this.navigator = navigator;
    }

    trigger(route) {
        if (route === null) {
            /* When we call `set_change_counter` with a new value, react will reload the element */
            var change_counter = this.change_counter + 1;
            this.change_counter = change_counter;
            this.set_change_counter(change_counter);
        } else {
            this.navigator(route);
        }
    }

    get_subscriber_callback(api) {
        return () => this._subscribe(api);
    }

    _subscribe(api) {
        api.subscribe(this);
        return () => this._unsubscribe(api);
    }

    _unsubscribe(api) {
        api.unsubscribe(this);
    }
}


export function get_loader_api_subscription() {
    var [change_counter, set_change_counter] = state_hook(0);
    var navigator = get_navigator();

    return new LoaderAPISubscription(change_counter, set_change_counter, navigator)
}
