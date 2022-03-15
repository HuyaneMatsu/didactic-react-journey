import {createElement as create_element} from 'react';

export function create_loader() {
    return create_element(
        'div',
        {'className': 'loader'},
    );
}
