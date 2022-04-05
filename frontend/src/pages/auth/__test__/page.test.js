import {render_in_router, logged_in_test, logged_off_test, get_redirect} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {AuthPage, TEST_ID_AUTH_PAGE} from './../page';

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
