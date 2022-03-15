import {createElement as create_element} from 'react';

export function create_content(content_element) {
    return create_element(
        'div',
        {'className': 'content'},
        content_element,
    );
}
