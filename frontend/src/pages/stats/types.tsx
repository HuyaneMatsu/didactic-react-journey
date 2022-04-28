import {STATS_RELOAD_DIFFERENCE} from './constants';
import {StatsData} from './../../structures';
import {get_unix_time} from './../../utils';


export class StatHolder {
    exception_message!: null | string;
    errored_at!: number;
    data: null | StatsData;

    constructor() {
        this.clear_exception_message();
        this.data = null;
    }

    set_data(data: StatsData): StatHolder {
        this.data = data;
        return this;
    }

    get_data() {
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
            if ((this.exception_message !== null) && (this.errored_at + STATS_RELOAD_DIFFERENCE < get_unix_time())) {
                should_reload = true;
            } else {
                should_reload = false;
            }
        } else {
            should_reload = false;
        }
        return should_reload;
    }
}
