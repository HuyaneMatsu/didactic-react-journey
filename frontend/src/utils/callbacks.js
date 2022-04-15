export function create_enter_press_callback(callback) {
    return (event) => check_enter_press_and_call(event, callback);
}

/* 32 = space */
/* 13 = enter */

function check_enter_press_and_call(event, callback) {
    var key_code = event.charCode;
    if (key_code === 13) {
        callback();
    }
}
