import {LOGIN_STATE} from './../../core';
import {Callback, Navigator} from './../../structures';

export function create_execute_logoff_callback(navigator: Navigator): Callback {
    return () => execute_logoff(navigator);
}

function execute_logoff(navigator: Navigator): void {
    LOGIN_STATE.clear();
    navigator('/');
}


export function create_cancel_logoff_callback(navigator: Navigator): Callback {
    return () => cancel_logoff(navigator);
}

function cancel_logoff(navigator: Navigator): void {
    navigator('/');
}
