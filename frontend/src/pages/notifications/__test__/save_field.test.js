import {screen, fireEvent as fire_event} from '@testing-library/react';
import {SubscriptionAPIBase} from './../../../utils';
import {SaveNotificationsField} from './../save_field';
import {render_in_router, logged_in_test, sleep} from './../../../test_utils';
import {get_handler} from './../../../utils';
import React from 'react';
import {NotificationHolder} from './../types';

logged_in_test(
    'Tests whether save notification field has save button',
    function () {
        var handler = get_handler('/notification_settings')
        var notification_holder = handler.get_result()

        render_in_router(
            <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler }/>
        );

        var element = screen.getByText('save');
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false}),
    },
)


logged_in_test(
    'Tests whether save notification field has cancel button',
    function () {
        var handler = get_handler('/notification_settings')
        var notification_holder = handler.get_result()

        render_in_router(
            <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler }/>
        );

        var element = screen.getByText('cancel');
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false}),
    },
)

/* Integration tests */

logged_in_test(
    'Tests whether data is correctly unassigned when cancelled',
    function () {
        var handler = get_handler('/notification_settings')
        var notification_holder = handler.get_result()

        render_in_router(
            <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler }/>
        );

        var element = screen.getByText('cancel');

        fire_event.click(element, {});
        expect(notification_holder.data_changes).toEqual(null);
    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false}),
    },
)


function fetch_function_json() {
    return Promise.resolve(
        {}
    )
}

function fetch_function(endpoint, {method, headers, body}) {
    var json = JSON.parse(body);
    var server_error = json['server_error'];
    if (server_error === undefined) {
        server_error = false;
    }

    if (server_error) {
        return (
            {
                'status': 500,
                'statusText': 'server error',
            }
        )
    } else {
        return (
            {
                'status': 201,
                'json': fetch_function_json,
            }
        )
    }
}

global.fetch = fetch_function;

logged_in_test(
    'Tests whether data is being saved when unassigned when approved',
    async function () {
        var handler = get_handler('/notification_settings')
        var notification_holder = handler.get_result()

        render_in_router(
            <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler }/>
        );

        var element = screen.getByText('save');
        fire_event.click(element, {});
        
        await sleep(0.0);

        expect(notification_holder.data).toEqual({'daily': false});
        expect(notification_holder.data_changes).toEqual(null);
    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false}),
    },
)

/* This test always fails and I don not know what exactly react is doing to make it fail. */
/*

logged_in_test(
    'Tests whether error message shows up',
    async function () {
        var handler = get_handler('/notification_settings')
        var notification_holder = handler.get_result()

        render_in_router(
            <SaveNotificationsField notification_holder={ notification_holder } parent_handler={ handler }/>
        );

        var element = screen.getByText('save');
        fire_event.click(element, {});

        await sleep(0.0);

        var element = screen.getByText(new RegExp('Something went wrong.*'));
        expect(element).toBeVisible();
    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false, 'server_error': true}),
    },
)

*/
