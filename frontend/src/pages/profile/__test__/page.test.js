import {render_in_router, logged_in_test, escape_regex} from './../../../test_utils';
import {screen} from '@testing-library/react';
import {ProfilePage} from './../page';
import {to_string, format_date} from './../../../utils';
import {LOGIN_STATE} from './../../../core';
import {TEST_ID_SPINNING_CIRCLE, TEST_ID_HEADER_NAVIGATOR_BUTTON} from './../../../components';
import React from 'react';


logged_in_test(
    'Tests whether user name is shown',
    function () {
        render_in_router(<ProfilePage />);

        var element = screen.getByText(LOGIN_STATE.user.get_full_name());
        expect(element).toBeVisible();
    },
)


logged_in_test(
    'Tests whether user id is shown',
    function () {
        render_in_router(<ProfilePage />);

        var element = screen.getByText(
            new RegExp(['.*', escape_regex(to_string(LOGIN_STATE.user.id)), '.*'].join(''))
        );
        expect(element).toBeVisible();
    },
)



logged_in_test(
    'Tests whether created at is shown',
    function () {
        render_in_router(<ProfilePage />);

        var element = screen.getByText(
            new RegExp(['.*', escape_regex(format_date(LOGIN_STATE.user.created_at)), '.*'].join(''))
        );
        expect(element).toBeVisible();
    },
)


logged_in_test(
    'Tests whether image is shown',
    function () {
        render_in_router(<ProfilePage />);

        var elements = screen.queryAllByAltText('avatar');
        expect (elements.length).toEqual(2);
    },
)


logged_in_test(
    'Tests whether the profile navigator button is clicked.',
    function () {
        render_in_router(<ProfilePage />);

        var header_button = screen.getByText('Profile');
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).toHaveClass('clicked');
    },
)


logged_in_test(
    'Whether other buttons are not clicked if profile is clicked.',
    function() {
        render_in_router(<ProfilePage />);

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);
        var clicked_button = screen.getByText('Profile');

        var header_button;
        for (header_button of header_buttons) {
            if (header_button === clicked_button) {
                continue
            };

            expect(header_button).not.toHaveClass('disabled');
            expect(header_button).not.toHaveClass('clicked');
        }
    },
)
