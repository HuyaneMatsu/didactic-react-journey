import {to_string} from './helpers';

export function build_exception_message_from_response(response) {
    var exception_message_parts = [];

    var status = response.status;
    exception_message_parts.push('Response: ');
    exception_message_parts.push(to_string(status));

    var status_message = response.statusText;
    if (status_message) {
        exception_message_parts.push(' ');
        exception_message_parts.push(status_message)
    }

    return exception_message_parts.join('');
}
