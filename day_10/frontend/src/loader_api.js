import {remove_from_list, get_from_nullable_dict} from './utils';
import {LOGIN_STATE} from './login_state';
import {API_BASE_URL} from './constants';


var LOADER_APIS = {};


class LoaderAPI {
    constructor(endpoint) {

        this.endpoint = endpoint;
        this.token = LOGIN_STATE.token;

        this.is_loaded = false;
        this.is_loading = false;

        this.data = null;
        this.data_changes = null;

        this.load();

        this.subscribers = [];
    }

    check_reload() {
        var token = LOGIN_STATE.token;
        if (this.token === token) {
            return;
        }

        this.token = token;

        this.is_loaded = false;
        this.is_loading = false;

        this.data = null;
        this.data_changes = null;

        this.load();
        this.display()
    }

    load () {
        if (this.is_loading) {
            return;
        }

        this.is_loading = true;

        fetch(
            API_BASE_URL + this.endpoint,
            {
                'headers': {
                    'Authorization': this.token,
                },
            },
        ).then(
            (request) => this.update_from_payload(request)
        );
    }

    async update_from_payload(request) {
        var status = request.status;
        if (status === 200) {
            var data = await request.json();

            LOGIN_STATE.un_authorized = false;

            this.data = data;
            this.is_loaded = true;
            this.is_loading = false;

            this.display();
        } else {
            this.is_loading = false;

            if (status === 401) {
                LOGIN_STATE.un_authorize();
                /* `.display()` wont do anything, because it will run ur own element only, which wont redirect, */
                /* because redirect is checked one stack above it */
                this.navigator('/');
            }
        }
    }

    display() {
        var subscriber;
        for (subscriber of this.subscribers) {
            subscriber.trigger();
        }
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        remove_from_list(this.subscribers, subscriber);
    }

    change_data(field_name, field_value, default_value, display_after) {
        var data = this.data;
        var data_changes = this.data_changes;

        var value_from_data = data[field_name];

        var should_add;

        if (value_from_data === undefined) {
            if (field_value === default_value) {
                should_add = false;
            } else {
                should_add = true;
            }
        } else {
            if (value_from_data === field_value) {
                should_add = false;
            } else {
                should_add = true;
            }
        }

        if (should_add) {
            if (data_changes === null) {
                data_changes = {};
                this.data_changes = data_changes;
            }
            data_changes[field_name] = field_value;

        } else {
            if (data_changes !== null) {
                delete data_changes[field_name];

                if (Object.keys(data_changes).length === 0) {
                    this.data_changes = null;
                }
            }
        }

        if (display_after) {
            this.display();
        }
    }

    revert_changes() {
        this.data_changes = null;
        this.display();
    }

    copy_changes() {
        return {...this.data_changes}
    }

    apply_changes(changes, default_value_map, default_default_value) {
        var data = this.data;
        var old_changes = this.copy_changes();

        var field_name, field_value, default_value;

        for ([field_name, field_value] of Object.entries(changes)) {
            default_value = get_from_nullable_dict(default_value_map, field_name, default_default_value);
            if (field_value === default_value) {
                delete data[field_name];
            } else {
                data[field_name] = field_value;
            }
        }

        if (old_changes !== null) {
            for ([field_name, field_value] of Object.entries(old_changes)) {
                this.change_data(
                    field_name,
                    field_value,
                    get_from_nullable_dict(default_value_map, field_name, default_default_value),
                    false,
                );
            }
        }

        this.display();
    }
}


export function get_loader_api(endpoint) {
    var loader_api = LOADER_APIS[endpoint];

    if (loader_api === undefined) {
        loader_api = new LoaderAPI(endpoint);
        LOADER_APIS[endpoint] = loader_api;

    } else {
       loader_api.check_reload();
    }

    return loader_api;
}
