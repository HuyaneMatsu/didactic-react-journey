import {screen, fireEvent as fire_event} from '@testing-library/react';
import {SubscriptionAPIBase} from './../../../utils';
import {SaveNotificationsField} from './../save_field';
import {render_in_router, logged_in_test, sleep} from './../../../test_utils';
import {get_page_loader_api} from './../../../utils';


logged_in_test(
    'Tests whether save notification field has save button',
    function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(<SaveNotificationsField page_loader_api={ page_loader_api }/>);

        var element = screen.getByText('save');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false},
    },
)


logged_in_test(
    'Tests whether save notification field has cancel button',
    function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(<SaveNotificationsField page_loader_api={ page_loader_api }/>);

        var element = screen.getByText('cancel');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false},
    },
)

/* Integration tests */

logged_in_test(
    'Tests whether data is correctly unassigned when cancelled',
    function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(<SaveNotificationsField page_loader_api={ page_loader_api }/>);

        var element = screen.getByText('cancel');

        fire_event.click(element, {});
        expect(page_loader_api.data_changes).toEqual(null);
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false},
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
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(<SaveNotificationsField page_loader_api={ page_loader_api }/>);

        var element = screen.getByText('save');
        fire_event.click(element, {});
        
        await sleep(0.0);

        expect(page_loader_api.data).toEqual({'daily': false});
        expect(page_loader_api.data_changes).toEqual(null);
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false},
    },
)

logged_in_test(
    'Tests whether error message shows up',
    async function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(<SaveNotificationsField page_loader_api={ page_loader_api }/>);

        var element = screen.getByText('save');
        fire_event.click(element, {});

        await sleep(0.0);

        var element = screen.getByText(new RegExp('Something went wrong.*'));
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false, 'server_error': true},
    },
)
