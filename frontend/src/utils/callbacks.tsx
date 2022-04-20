import {KeyboardEvent} from 'react';

export function create_enter_press_callback(
    callback: () => void
): (event: KeyboardEvent<HTMLButtonElement>) => void {
    return (event: KeyboardEvent<HTMLButtonElement>) => check_enter_press_and_call(event, callback);
}

export var KEY_CODE_ENTER: number = 13;
export var KEY_CODE_SPACE: number = 32;


function check_enter_press_and_call(event: KeyboardEvent<HTMLButtonElement>, callback: () => void) {
    var key_code: number = event.charCode;
    if (key_code === KEY_CODE_ENTER) {
        callback();
    }
}
