import {render_in_router, logged_in_test, logged_off_test, get_redirect, sleep} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {AuthPage} from './../page';
import {LOGIN_STATE} from './../../../core';


logged_off_test(
    'Tests whether auth page redirects as expected | with no code.',
    function () {
        render_in_router(<AuthPage />);

        var element = screen.getByText('Redirecting');
        expect(element).toBeVisible();
        expect(get_redirect()).toEqual('/');
    },
)

logged_off_test(
    'Tests whether auth page redirects as expected | with good code.',
    function () {
        render_in_router(<AuthPage />);

        var element = screen.getByText('Authorizing | Redirecting');
        expect(element).toBeVisible();
        /* We redirect only after the request is done, we do not test that request yet. */
        expect(get_redirect()).toEqual(null);
    },
    {
        'query': {
            'code': 'pudding',
        },
    },
)

/* Integration tests */


function fetch_function_json() {
    return Promise.resolve(
        {
            'token': 'a.a.aa',
            'expires_at': '2062-03-29T21:57:54.977000+00:00',
            'user': {
                'id': '420691337',
                'created_at': '2022-03-29T21:57:54.977000+00:00',
                'name': 'nue',
                'avatar_hash': '0',
                'avatar_type': 0,
                'discriminator': 0,
            },
        }
    )
}

function fetch_function() {
    return Promise.resolve(
        {
            'status': 200,
            'json': fetch_function_json,
        }
    )
}

global.fetch = fetch_function;

logged_off_test(
    'Tests whether auth page redirects as expected | with code.',
    async function () {
        render_in_router(<AuthPage />);

        await sleep(0);

        expect(get_redirect()).toEqual('/');
    },
    {
        'query': {
            'code': 'pudding',
        },
    },
)


logged_off_test(
    'Tests whether auth page sets values as expected',
    async function () {
        render_in_router(<AuthPage />);

        await sleep(0);

        expect(LOGIN_STATE.is_logged_in).toEqual(true);
        expect(localStorage.getItem('token')).toEqual('a.a.aa');
    },
    {
        'query': {
            'code': 'pudding',
        },
    },
)
