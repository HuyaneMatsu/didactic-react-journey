import {render_in_router, logged_in_test, escape_regex, sleep} from './../../../../test_utils';
import {screen, fireEvent as fire_event} from '@testing-library/react';
import {StatsPageSellDaily} from './../sell_daily';
import {to_string, format_date, get_handler} from './../../../../utils';
import {TEST_ID_STATS_PAGE_SELL_DAILY_INPUT, TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT} from './../constants';
import React from 'react';
import {StatHolder} from './../../types';


logged_in_test(
    'Tests whether question is shown',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByText(new RegExp('How much.*'));
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

logged_in_test(
    'Tests whether approve button is shown',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByText('Lets do it!');
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

logged_in_test(
    'Tests whether back button is shown',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByText('Back to safety');
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether input is shown',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether nothing is shown',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        expect(element.value).toEqual('');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

/* Integration tests */


function fetch_function_json() {
    return Promise.resolve(
        {
            'total_love': 100,
            'streak': 99,
        }
    )
}

function fetch_function(endpoint, {method, headers, body}) {
    var json = JSON.parse(body);
    var amount = json['amount'];
    if (amount === '500') {
        return Promise.resolve(
            {
                'status': 500,
                'statusText': 'Server error',
            }
        );
    } else {
        return Promise.resolve(
            {
                'status': 200,
                'json': fetch_function_json,
            }
        );
    }
}

global.fetch = fetch_function;


logged_in_test(
    'Tests whether value is updated',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': '0'}})

        expect(element.value).toEqual('0');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether value is updated v2',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': '00'}})

        expect(element.value).toEqual('0');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether value is updated v3',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': '01'}})

        expect(element.value).toEqual('1');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether value is updated v4',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': 'AA'}})

        expect(element.value).toEqual('');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether value is updated v5',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': '51456465'}})

        expect(element.value).toEqual('100');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)


logged_in_test(
    'Tests whether request is made and we get responded; our streak should be updated',
    function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);

        fire_event.change(element, {'target': {'value': '00'}})

        expect(element.value).toEqual('0');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

logged_in_test(
    'Tests whether at the case of 0 nothing is updated',
    async function () {

        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        fire_event.change(element, {'target': {'value': '0'}})

        var submit_element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT);

        expect(element.value).toEqual('0');


        fire_event.click(submit_element);

        await sleep(0);

        expect(element.value).toEqual('0');
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

logged_in_test(
    'Tests whether request at the case of 1 our values are indeed updated',
    async function () {
        var stat_holder = get_handler('/stats').get_result();
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 100} }stat_holder={ stat_holder }/>
        );
        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        fire_event.change(element, {'target': {'value': '1'}})

        var submit_element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT);
        fire_event.click(submit_element)

        await sleep(0);

        expect(element.value).toEqual('1');
        expect(stat_holder.data['streak']).toEqual(99);
        expect(stat_holder.data['total_love']).toEqual(100);

    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 100}),
    },
)

/*

logged_in_test(
    'Tests whether error message shows up',
    async function () {
        render_in_router(
            <StatsPageSellDaily data={ {'streak': 600} } stat_holder={ get_handler('/stats').get_result() }/>
        );

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        fire_event.change(element, {'target': {'value': '500'}})

        var submit_element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_SUBMIT);
        fire_event.click(submit_element)

        await sleep(0.0);

        var element = screen.getByText(new RegExp('Something went wrong.*'));
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/stats',
        'handler_result': new StatHolder().set_data({'streak': 600}),
    },
)

*/
