import {useEffect as use_effect} from 'react';

import {LOGIN_STATE} from './../login_state';
import {get_loader_api_subscription} from './../hooks/subscription_hook';
import {create_header} from './header';
import {create_content} from './content';
import {create_loader} from './loader';
import {to_string} from './../utils';
import {get_loader_api} from './../loader_api';


export function StatsPage() {
    var subscription = get_loader_api_subscription();
    var loader_api = get_loader_api('/stats')

    use_effect(subscription.get_subscriber_callback(loader_api), [])

    var content_element;
    if (loader_api.is_loaded) {
        var data = loader_api.data;

        content_element = (
            <div className='stats'>
                <p>
                    Hearts {to_string(data['total_love'])}
                </p>
                <p>
                    Streak {to_string(data['streak'])}
                </p>
            </div>

        )
    } else {
        content_element = create_loader();
    }

    return (
        <>
            { create_header('stats') }
            { create_content(content_element) }
        </>
    );
}
