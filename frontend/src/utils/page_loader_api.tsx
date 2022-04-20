import {LOGIN_STATE} from './../core';
import {API_BASE_URL} from './../constants';

import {get_from_nullable_dict} from './helpers';
import {SubscriptionAPIBase} from './subscription_base';
import {get_unix_time} from './time';
import {build_exception_message_from_response} from './exception_message_builder';


var LOADER_APIS: Record<string, PageLoaderAPI> = {};
var RELOAD_DIFFERENCE = 600.0;

export class PageLoaderAPI extends SubscriptionAPIBase {
    endpoint: string;
    token: null | string;
    is_loaded: boolean;
    is_loading: boolean;
    data: null | Record<string, any>;
    data_changes: null | Record<string, any>;
    exception_message!: null | string;
    errored_at!: number;

    constructor(endpoint: string, data: null | Record<string, any>) {
        super();

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

    reset_exception_message(): void {
        this.exception_message = null;
        this.errored_at = 0.0;
    }
    
    set_exception_message(exception_message: string): void {
        this.exception_message = exception_message;
        this.errored_at = get_unix_time();

    }
    
    check_reload(): void {
        var should_reload_errored: boolean;
        if ((this.exception_message !== null) && (this.errored_at + RELOAD_DIFFERENCE < get_unix_time())) {
            should_reload_errored = true;
        } else {
            should_reload_errored = false;
        }

        var should_reload_token_change: boolean;
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
        this.display(null);
    }

    load(): void {
        if (this.is_loading) {
            return;
        }

        var token: null | string = this.token;
        if (token === null) {
            return;
        }

        this.is_loading = true;

        fetch(
            API_BASE_URL + this.endpoint,
            {
                'headers': {
                    'Authorization': token,
                },
            },
        ).then(
            (response) => this.update_from_response(response)
        );
    }

    async update_from_response(response: Response): Promise<void> {
        var status = response.status;
        if (status === 200) {
            var data = await response.json();

            LOGIN_STATE.un_authorized = false;

            this.set_data(data);
            this.reset_exception_message();

            this.display(null);
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

    set_data(data: Record<string, any>): void {
        this.data = data;
        this.is_loaded = true;
        this.is_loading = false;
    }

    change_data(field_name: string, field_value: any, default_value: any, display_after: boolean): void {
        var data = this.data;
        var data_changes = this.data_changes;
        var value_from_data: undefined | any;

        if (data === null) {
            value_from_data = undefined;
        } else {
            value_from_data = data[field_name];
        }

        var should_add: boolean;

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
            this.display(null);
        }
    }

    revert_changes(): void {
        this.data_changes = null;
        this.display(null);
    }

    copy_changes(): Record<string, any> {
        return {...this.data_changes}
    }

    apply_changes(changes: any, default_value_map: null | Record<string, any>, default_default_value: any): void {
        var data = this.data;
        var old_changes = this.copy_changes();

        var field_name, field_value, default_value;

        for ([field_name, field_value] of Object.entries(changes)) {
            default_value = get_from_nullable_dict(default_value_map, field_name, default_default_value);
            if (field_value === default_value) {
                if (data !== null) {
                    delete data[field_name];
                }
            } else {
                if (data === null) {
                    data = {};
                    this.data = data;
                }
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

        this.display(null);
    }
}


export function get_page_loader_api(endpoint: string, data?: undefined | null | Record<string, any>): PageLoaderAPI {
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


export function remove_page_loader_api(endpoint: string): void {
    delete LOADER_APIS[endpoint];
}
