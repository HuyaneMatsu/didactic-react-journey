import {NOTIFICATIONS_RELOAD_DIFFERENCE} from './constants';
import {NotificationData} from './../../structures';
import {get_unix_time, iter_dict_items, get_from_nullable_dict} from './../../utils';


export class NotificationHolder {
    exception_message!: null | string;
    errored_at!: number;
    data: null | NotificationData;
    data_changes: null | NotificationData

    constructor() {
        this.clear_exception_message();
        this.data = null;
        this.data_changes = null;
    }

    set_data(data: NotificationData): NotificationHolder {
        this.data = data;
        return this;
    }

    set_changes(data_changes: NotificationData): NotificationHolder {
        this.data_changes = data_changes;
        return this;
    }

    get_data(): null | NotificationData {
        return this.data;
    }

    clear_exception_message(): void {
        this.exception_message = null;
        this.errored_at = 0.0;
    }

    set_exception_message(exception_message: string): void {
        this.exception_message = exception_message;
        this.errored_at = get_unix_time();
    }

    should_reload() {
        var should_reload: boolean;
        if (this.get_data() === null) {
            if ((this.exception_message !== null) && (this.errored_at + NOTIFICATIONS_RELOAD_DIFFERENCE < get_unix_time())) {
                should_reload = true;
            } else {
                should_reload = false;
            }
        } else {
            should_reload = false;
        }
        return should_reload;
    }

    change_data(
        field_name: keyof NotificationData,
        field_value: NotificationData[keyof NotificationData],
        default_value: NotificationData[keyof NotificationData]
    ): void {
        var data: null | NotificationData = this.data;
        var data_changes: null | NotificationData = this.data_changes;
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
                data_changes = {} as NotificationData;
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
    }

    revert_changes(): void {
        this.data_changes = null;
    }

    copy_changes(): null | NotificationData {
        var data_changes: null | NotificationData = this.data_changes;
        if (data_changes !== null) {
            data_changes = {...this.data_changes} as NotificationData;
        }

        return data_changes;
    }

    apply_changes(
        changes: null | NotificationData,
        default_value_map: null | NotificationData,
        default_default_value: NotificationData[keyof NotificationData],
    ): void {
        var data = this.data;
        var old_changes: null | NotificationData = this.copy_changes();

        var field_name: keyof NotificationData;
        var field_value: NotificationData[keyof NotificationData];
        var default_value: NotificationData[keyof NotificationData];

        if (changes !== null) {
            for ([field_name, field_value] of iter_dict_items(changes)) {
                default_value = get_from_nullable_dict(default_value_map, field_name, default_default_value);
                if (field_value === default_value) {
                    if (data !== null) {
                        delete data[field_name];
                    }
                } else {
                    if (data === null) {
                        data = {} as NotificationData;
                        this.data = data;
                    }
                    data[field_name] = field_value;
                }
            }
        }

        if (old_changes !== null) {
            for ([field_name, field_value] of iter_dict_items(old_changes)) {
                this.change_data(
                    field_name,
                    field_value,
                    get_from_nullable_dict(default_value_map, field_name, default_default_value),
                );
            }
        }
    }
    
}
