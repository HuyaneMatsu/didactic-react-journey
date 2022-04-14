import {LOGIN_STATE} from './../core';
import {API_BASE_URL} from './../constants';

import {get_from_nullable_dict} from './helpers';
import {SubscriptionAPIBase} from './subscription_base';
import {get_unix_time} from './time';
import {build_exception_message_from_response} from './exception_message_builder';


var LOADER_APIS = {};
var RELOAD_DIFFERENCE = 600.0;

export class PageLoaderAPI extends SubscriptionAPIBase {
    constructor(endpoint, data) {
        super()

        this.endpoint = endpoint;
        this.token = LOGIN_STATE.token;

        this.is_loaded = false;
        this.is_loading = false;

        this.data = null;
        this.data_changes = null;

        this.reset_exception_message();

        if (data === null) {
            this.load();
        } else {
            this.set_data(data);
        }
    }

    reset_exception_message() {
        this.exception_message = null;
        this.errored_at = 0.0;
    }
    
    set_exception_message(exception_message) {
        this.exception_message = exception_message;
        this.errored_at = get_unix_time();

    }
    
    check_reload() {
        var should_reload_errored;
        if ((this.exception_message !== null) && (this.errored_at + RELOAD_DIFFERENCE < get_unix_time())) {
            should_reload_errored = true;
        } else {
            should_reload_errored = false;
        }

        var should_reload_token_change;
        var token = LOGIN_STATE.token;
        if (this.token === token) {
            should_reload_token_change = false;
        } else {
            should_reload_token_change = true;
            this.token = token;
        }

        if (!(should_reload_token_change || should_reload_errored)) {
            return
        }

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
            (response) => this.update_from_response(response)
        );
    }

    async update_from_response(response) {
        var status = response.status;
        if (status === 200) {
            var data = await response.json();

            LOGIN_STATE.un_authorized = false;

            this.set_data(data);
            this.reset_exception_message();

            this.display();
        } else {
            this.is_loading = false;

            if (status === 401) {
                LOGIN_STATE.un_authorize();
                this.reset_exception_message();

                /* `.display()` wont do anything, because it will run ur own element only, which wont redirect, */
                /* because redirect is checked one stack above it */

                this.display('/');
            } else {
                this.set_exception_message(build_exception_message_from_response(response));
            }
        }
    }

    set_data(data) {
        this.data = data;
        this.is_loaded = true;
        this.is_loading = false;
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


export function get_page_loader_api(endpoint, data) {
    if (data === undefined) {
        data = null;
    }

    var page_loader_api = LOADER_APIS[endpoint];

    if (page_loader_api === undefined) {
        page_loader_api = new PageLoaderAPI(endpoint, data);
        LOADER_APIS[endpoint] = page_loader_api;

    } else {
       page_loader_api.check_reload();
    }

    return page_loader_api;
}


export function remove_page_loader_api(endpoint) {
    delete LOADER_APIS[endpoint]
}
