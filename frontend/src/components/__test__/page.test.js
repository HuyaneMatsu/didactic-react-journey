import {render_in_router, logged_in_test, logged_off_test} from './../../test_utils';
import {render, screen} from '@testing-library/react';
import {Page} from './../page';
import {TEST_ID_HEADER, TEST_ID_HEADER_NAVIGATOR_BUTTON, TEST_ID_HEADER_LOGIN} from './../header';

test(
    'Tests whether the content is displayed',
    function() {
        var displayed_value = 'pudding'

        render_in_router(
            <Page clicked={ null } content={ displayed_value } />
        );

        var content = screen.getByText(displayed_value);
        expect(content).toBeVisible();
    }
)


test(
    'Tests whether the headers are visible',
    function() {
        render_in_router(
            <Page clicked={ null } content={ 'pudding' } />
        );

        var header = screen.getByTestId(TEST_ID_HEADER);
        expect(header).toBeVisible();
    }
)


test(
    'Tests whether 3 buttons are displayed.',
    function() {
        render_in_router(
            <Page clicked={ null } content={ 'pudding' } />
        );

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);
        expect(header_buttons.length).toEqual(3);
    }
)

test(
    'Test whether the header has login button equipped.',
    function() {
        render_in_router(
            <Page clicked={ null } content={ 'pudding' } />
        );

        var login_button = screen.getByTestId(TEST_ID_HEADER_LOGIN);
        expect(login_button).toBeVisible();
    }
)



logged_in_test(
    'Test whether the header has all 3 buttons is inactive if no button is clicked.',
    function() {
        render_in_router(
            <Page clicked={ null } content={ 'pudding' } />
        );

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);

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
            <Page clicked={ 'notifications' } content={ 'pudding' } />
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
            <Page clicked={ 'notifications' } content={ 'pudding' } />
        );

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);
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
