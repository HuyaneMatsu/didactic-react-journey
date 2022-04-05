import {screen} from '@testing-library/react';
import {SubscriptionAPIBase} from './../../../utils';
import {SaveNotificationsField} from './../save_field';
import {render_in_router, logged_in_test} from './../../../test_utils';
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
        'loader_api_data_changes': {'daily': true},
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
        'loader_api_data_changes': {'daily': true},
    },
)
