import {render_in_router, logged_in_test, logged_off_test} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {MainPage} from './../page';
import React from 'react';

var WELCOME_RP = new RegExp('[wW]elcome.*');

logged_in_test(
    'Tests whether main page shows correctly when not logged in',
    function () {
        render_in_router(<MainPage />);

        var element = screen.getByText(WELCOME_RP);
        expect(element).toBeVisible();
    },
)

logged_off_test(
    'Tests whether main page shows correctly when logged off',
    function () {
        render_in_router(<MainPage />);

        var element = screen.getByText('Please log in first');
        expect(element).toBeVisible();
    },
)

logged_off_test(
    'Tests whether main page shows correctly when expired',
    function () {
        render_in_router(<MainPage />);

        var element = screen.getByText('Something went wrong');
        expect(element).toBeVisible();
        var element = screen.getByText('Your session expired, please login');
        expect(element).toBeVisible();
    },
    {
        'un_authorized': true,
        'was_logged_in': true,
    }
)
