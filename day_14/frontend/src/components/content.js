import {createElement as create_element} from 'react';

export function create_content(content_element) {
    return (
        <div className='content'>
            { content_element }
        </div>
    )
}
