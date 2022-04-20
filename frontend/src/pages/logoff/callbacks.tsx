import {LOGIN_STATE} from './../../core';

export function create_execute_logoff_callback(navigator: (value: string) => void): () => void {
    return () => execute_logoff(navigator);
}

function execute_logoff(navigator: (value: string) => void): void {
    LOGIN_STATE.clear();
    navigator('/');
}


export function create_cancel_logoff_callback(navigator: (value: string) => void): () => void {
    return () => cancel_logoff(navigator);
}

function cancel_logoff(navigator: (value: string) => void): void {
    navigator('/');
}
