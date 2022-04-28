import {render_in_router, logged_in_test, sleep} from './../../../test_utils';
import {screen} from '@testing-library/react';
import {StatsPage} from './../page';
import {TEST_ID_SPINNING_CIRCLE, TEST_ID_HEADER_NAVIGATOR_BUTTON} from './../../../components';
import React from 'react';
import {StatHolder} from './../types';


logged_in_test(
    'Tests whether spinning circle is shown when data is not requested',
    function () {
        render_in_router(<StatsPage />);

        var element = screen.getByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
    },
)

logged_in_test(
    'Tests whether spinning circle is not shown when data is requested.',
    function () {
        render_in_router(<StatsPage />);

        var element = screen.queryByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(element).toEqual(null);
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({}),
    },
)


logged_in_test(
    'Tests whether the stats navigator button is clicked.',
    function () {
        render_in_router(<StatsPage />);

        var header_button = screen.getByText('Stats');
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).toHaveClass('clicked');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({}),
    },
)


logged_in_test(
    'Whether other buttons are not clicked if stats is clicked.',
    function() {
        render_in_router(<StatsPage />);

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);
        var clicked_button = screen.getByText('Stats');

        var header_button;
        for (header_button of header_buttons) {
            if (header_button === clicked_button) {
                continue
            };

            expect(header_button).not.toHaveClass('disabled');
            expect(header_button).not.toHaveClass('clicked');
        }
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({}),
    },
)



logged_in_test(
    'Whether the stats are shown',
    async function() {
        render_in_router(<StatsPage />);

        var element = screen.queryByText('Hearts 100');
        expect(element).toBeVisible();

        var element = screen.queryByText('Streak 100');
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({
            'total_love': 100,
            'streak': 100,
        })
    },
)


/* Integration tests */


function fetch_function_json() {
    return Promise.resolve(
        {
            'total_love': 100,
            'streak': 100,
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


logged_in_test(
    'Whether spinning circle is not shown when request is done',
    async function() {
        render_in_router(<StatsPage />);

        await sleep(0.0);


        var element = screen.queryByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(element).toEqual(null);
    },
    {
        'handler_custom_id': '/stats',
    },
)
