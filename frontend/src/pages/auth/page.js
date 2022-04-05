import {useNavigate as get_navigator} from 'react-router-dom';
import {useEffect as use_effect} from 'react';

import {get_query} from './../../utils/get_query';
import {LoadingPage} from './../../components';

import {create_authorization_callback} from './callbacks';


export var TEST_ID_AUTH_PAGE = 'auth_page';

export function AuthPage() {
    var navigator = get_navigator();

    var query = get_query();

    var code = query.get('code');
    var title;

    use_effect(
        create_authorization_callback(code, navigator),
        [code],
    );

    if (code === null) {
        title = 'Redirecting';

    } else {
        title = 'Authorizing | Redirecting';
    }

    return <LoadingPage data-testid={ TEST_ID_AUTH_PAGE } title={ title } />;
}

AuthPage.propTypes = {};
