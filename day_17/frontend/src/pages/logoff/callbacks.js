import {LOGIN_STATE} from './../../core';

export function create_execute_logoff_callback(navigator) {
    return () => execute_logoff(navigator);
}

function execute_logoff(navigator) {
    LOGIN_STATE.clear();
    navigator('/');
}


export function create_cancel_logoff_callback(navigator) {
    return () => cancel_logoff(navigator);
}

function cancel_logoff(navigator) {
    navigator('/');
}
