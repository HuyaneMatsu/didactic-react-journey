export function create_enter_press_callback(callback: object) {
    return (event) => check_enter_press_and_call(event, callback);
}

var KEY_CODE_ENTER = 13;
var KEY_CODE_SPACE = 32;


function check_enter_press_and_call(event: KeyboardEvent, callback: object) {
    var key_code = event.charCode;
    if (key_code === KEY_CODE_ENTER) {
        callback();
    }
}
