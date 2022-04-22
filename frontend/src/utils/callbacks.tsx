import {KeyboardEvent} from 'react';
import {ButtonKeyEvent, ButtonKeyEventCallback, Callback} from './../structures';


export function create_enter_press_callback(
    callback: Callback,
): ButtonKeyEventCallback {
    return (event: ButtonKeyEvent) => check_enter_press_and_call(event, callback);
}

export var KEY_CODE_ENTER: number = 13;
export var KEY_CODE_SPACE: number = 32;


function check_enter_press_and_call(event: ButtonKeyEvent, callback: Callback) {
    var key_code: number = event.charCode;
    if (key_code === KEY_CODE_ENTER) {
        callback();
    }
}
