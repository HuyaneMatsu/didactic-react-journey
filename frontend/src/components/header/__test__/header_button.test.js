import {render_in_router, logged_in_test, logged_off_test} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {HeaderButton, HEADER_NAVIGATOR_TEST_ID} from './../header_button';
import {LOGIN_STATE} from './../../../core';


test(
    'Tests whether the component exists',
    function() {
        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ 'Notifications' }
                clicked={ null }
            />
        );

        var header_button = screen.getByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_button).toBeVisible();
    }
)

test(
    'Tests whether the component display the correct text',
    function() {
        var display_name = 'Notifications'

        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ display_name }
                clicked={ null }
            />
        );

        var header_button = screen.getByText(display_name);
        expect(header_button).toBeVisible();
    }
)


logged_off_test(
    'Tests whether the component\'s class is disabled when logged out',
    function() {
        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ 'Notifications' }
                clicked={ null }
            />
        );

        var header_button = screen.getByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_button).toHaveClass('disabled');
        expect(header_button).not.toHaveClass('clicked');
    }
)


logged_off_test(
    'Tests whether the component\'s class is disabled when logged out & even if clicked',
    function() {
        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ 'Notifications' }
                clicked={ 'notifications' }
            />
        );

        var header_button = screen.getByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_button).toHaveClass('disabled');
        expect(header_button).not.toHaveClass('clicked');
    }
)

logged_in_test(
    'Tests whether the component\'s class is neither clicked | disabled when logged in & not clicked',
    function() {
        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ 'Notifications' }
                clicked={ null }
            />
        );

        var header_button = screen.getByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).not.toHaveClass('clicked');
    }
)

logged_in_test(
    'Tests whether the component\'s class is clicked when logged in & clicked',
    function() {
        render_in_router(
            <HeaderButton
                system_name={ 'notifications' }
                to={ '/notifications' }
                display_name={ 'Notifications' }
                clicked={ 'notifications' }
            />
        );

        var header_button = screen.getByTestId(HEADER_NAVIGATOR_TEST_ID);
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).toHaveClass('clicked');
    }
)
