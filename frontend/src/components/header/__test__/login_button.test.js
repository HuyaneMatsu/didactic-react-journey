import {render_in_router, logged_in_test, logged_off_test} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {LoginButton, TEST_ID_HEADER_LOGIN} from './../login_button';
import {LOGIN_STATE} from './../../../core';

test(
    'Tests whether the component\'s is displayed.',
    function() {
        render_in_router(
            <LoginButton />
        );

        var login_button = screen.getByTestId(TEST_ID_HEADER_LOGIN);
        expect(login_button).toBeVisible();
    }
)

logged_off_test(
    'Tests whether the component\'s text when logged out',
    function() {
        render_in_router(
            <LoginButton />
        );

        var login_button = screen.getByTestId(TEST_ID_HEADER_LOGIN);
        expect(login_button).toHaveTextContent('Login');
    }
)

logged_in_test(
    'Tests whether the component\'s text when logged in',
    function() {
        render_in_router(
            <LoginButton />
        );

        var login_button = screen.getByTestId(TEST_ID_HEADER_LOGIN);
        expect(login_button).toHaveTextContent(LOGIN_STATE.user.get_full_name());
    }
)

logged_in_test(
    'Tests whether the text has an icon',
    function() {
        /* Clear login state */
        render_in_router(
            <LoginButton />
        );

        var icon = screen.getByRole('img');
        expect(icon).toBeVisible();
        expect(icon).toHaveAttribute('src');
    }
)
