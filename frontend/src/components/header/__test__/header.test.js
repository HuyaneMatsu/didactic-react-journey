import {render_in_router, logged_in_test, logged_off_test} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {Header} from './../header';
import {HEADER_NAVIGATOR_TEST_ID} from './../header_button';
import {LOGIN_STATE} from './../../../core';
import {HEADER_LOGIN_TEST_ID} from './../login_button';

test(
    'Test whether the header is shown',
    function() {
        render_in_router(
            <Header clicked={ null } />
        );

        var header_button = screen.getByRole('navigation');
        expect(header_button).toBeVisible();
    }
)

test(
    'Test whether the header has login button equipped.',
    function() {
        render_in_router(
            <Header clicked={ null } />
        );

        var login_button = screen.getByTestId(HEADER_LOGIN_TEST_ID);
        expect(login_button).toBeVisible();
    }
)


test(
    'Test whether the header has 3 buttons equipped.',
    function() {
        render_in_router(
            <Header clicked={ null } />
        );

        var header_buttons = screen.queryAllByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_buttons.length).toEqual(3);
    }
)

logged_in_test(
    'Test whether the header has all 3 buttons is inactive if no button is clicked.',
    function() {
        render_in_router(
            <Header clicked={ null } />
        );

        var header_buttons = screen.queryAllByTestId(HEADER_NAVIGATOR_TEST_ID);

        var header_button;
        for (header_button of header_buttons) {
            expect(header_button).not.toHaveClass('disabled');
            expect(header_button).not.toHaveClass('clicked');
        }

    }
)

logged_in_test(
    'Whether one button is clicked if passed',
    function() {
        render_in_router(
            <Header clicked={ 'notifications' } />
        );

        var header_button = screen.getByText('Notifications');
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).toHaveClass('clicked');
    }
)

logged_in_test(
    'Whether other buttons are disabled if one is clicked',
    function() {
        render_in_router(
            <Header clicked={ 'notifications' } />
        );

        var header_buttons = screen.queryAllByTestId(HEADER_NAVIGATOR_TEST_ID);
        var clicked_button = screen.getByText('Notifications');

        var header_button;
        for (header_button of header_buttons) {
            if (header_button === clicked_button) {
                continue
            };

            expect(header_button).not.toHaveClass('disabled');
            expect(header_button).not.toHaveClass('clicked');
        }
    }
)
