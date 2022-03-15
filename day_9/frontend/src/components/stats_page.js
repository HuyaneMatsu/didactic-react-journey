import {createElement as create_element, Fragment} from 'react';

import {LOGIN_STATE} from './../login_state';
import {get_loader_hook} from './../hooks/loader_hook';
import {create_header} from './header';
import {create_content} from './content';
import {create_loader} from './loader';
import {to_string} from './../utils';


export function StatsPage() {
    var loader_hook = get_loader_hook('/stats');
    var content_element;

    if (loader_hook.is_loaded) {
        var data = loader_hook.data;

        content_element = create_element(
            'div',
            {'className': 'stats'},
            create_element(
                'p',
                null,
                'Hearts: ',
                to_string(data['total_love']),
            ),
            create_element(
                'p',
                null,
                'Streak: ',
                to_string(data['streak']),
            ),
        )
    } else {
        content_element = create_loader();
    }

    return create_element(
        Fragment,
        null,
        create_header('stats'),
        create_content(content_element),
    )
}

