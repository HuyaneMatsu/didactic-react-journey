import {render_in_router, logged_in_test, logged_off_test, get_redirect} from './../../../test_utils';
import {render, screen, fireEvent as fire_event} from '@testing-library/react';
import {LogoffPage} from './../page';
import {TEST_ID_HEADER_NAVIGATOR_BUTTON, TEST_ID_HEADER_LOGIN} from './../../../components';
import {LOGIN_STATE} from './../../../core';


var QUESTIONING_RP = new RegExp('.*you sure.*');
var APPROVE_RP = new RegExp('Yeah');
var REJECT_RP = new RegExp('Nah');


logged_in_test(
    'whether we are asking the user',
    function () {
        render_in_router( <LogoffPage /> );

        var label = screen.getByText(QUESTIONING_RP);
        expect(label).toBeVisible();
    }
);


logged_in_test(
    'whether the user has approve option',
    function () {
        render_in_router( <LogoffPage /> );

        var option = screen.getByText(APPROVE_RP);
        expect(option).toBeVisible();
    }
);


logged_in_test(
    'whether the user has reject option',
    function () {
        render_in_router( <LogoffPage /> );

        var option = screen.getByText(REJECT_RP);
        expect(option).toBeVisible();
    }
);


logged_in_test(
    'whether no navigator button is clicked',
    function () {
        render_in_router( <LogoffPage /> );

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);

        var header_button;
        for (header_button of header_buttons) {
            expect(header_button).not.toHaveClass('disabled');
            expect(header_button).not.toHaveClass('clicked');
        }
    }
);

logged_in_test(
    'whether login button is visible',
    function () {
        render_in_router( <LogoffPage /> );

        var login_button = screen.getByTestId(TEST_ID_HEADER_LOGIN);
        expect(login_button).toBeVisible();
    }
);


/* Integration Tests */


logged_in_test(
    'Test logging off redirect',
    function () {
        render_in_router( <LogoffPage /> );

        var element = screen.getByText(APPROVE_RP);
        fire_event.click(element);

        var redirect = get_redirect()
        expect(redirect).toEqual('/');
    }
);


logged_in_test(
    'Test logging off login state & local storage update',
    function () {
        render_in_router( <LogoffPage /> );

        var element = screen.getByText(APPROVE_RP);
        fire_event.click(element);

        expect(LOGIN_STATE.is_logged_in).toEqual(false);
        expect(localStorage.getItem('token')).toEqual(null);
    }
);


logged_in_test(
    'Test cancel logging off redirect',
    function () {
        render_in_router( <LogoffPage /> );

        var element = screen.getByText(APPROVE_RP);
        fire_event.click(element);

        var redirect = get_redirect()
        expect(redirect).toEqual('/');
    }
);
