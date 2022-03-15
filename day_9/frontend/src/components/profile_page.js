import {createElement as create_element, Fragment} from 'react';

import {LOGIN_STATE} from './../login_state';
import {to_string, format_date} from './../utils';
import {create_header} from './header';
import {create_content} from './content';


export function ProfilePage() {
    var content_element = create_element(
        'div',
        {'className': 'profile'},
        create_element(
            'div',
            {'className': 'left'},
            create_element(
                'h1',
                null,
                LOGIN_STATE.user.name,
            ),
            create_element(
                'p',
                null,
                'id: ',
                to_string(LOGIN_STATE.user.id),
            ),
            create_element(
                'p',
                null,
                'Created at: ',
                format_date(LOGIN_STATE.user.created_at),
            ),
        ),
        create_element(
            'div',
            {'className': 'right'},
            create_element(
                'img',
                {'src': LOGIN_STATE.user.get_avatar_url_as(null, 512)},
            ),
        ),
    );

    return create_element(
        Fragment,
        null,
        create_header('profile'),
        create_content(content_element),
    )
}
