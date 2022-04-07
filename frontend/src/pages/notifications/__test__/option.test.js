import {render_in_router, logged_in_test} from './../../../test_utils';
import {screen, fireEvent as fire_event} from '@testing-library/react';
import {TEST_ID_SPINNING_CIRCLE, TEST_ID_HEADER_NAVIGATOR_BUTTON} from './../../../components';
import {NotificationOption, TEST_ID_NOTIFICATION_OPTION} from './../option';
import {get_page_loader_api} from './../../../utils';


logged_in_test(
    'Tests whether data is correctly shown when changed.',
    function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(
            <NotificationOption
                page_loader_api={ page_loader_api }
                system_name={ 'daily' }
                display_name={ 'Daily' }
            />
        );

        var element = screen.getByTestId(TEST_ID_NOTIFICATION_OPTION);

        fire_event.click(element, {});

        expect(page_loader_api.data_changes['daily']).toEqual(false);

    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
    },
)

logged_in_test(
    'Tests whether data is correctly. unassigned when changed',
    function () {
        var page_loader_api = get_page_loader_api('/notification_settings')

        render_in_router(
            <NotificationOption
                page_loader_api={ page_loader_api }
                system_name={ 'daily' }
                display_name={ 'Daily' }
            />
        );

        var element = screen.getByTestId(TEST_ID_NOTIFICATION_OPTION);

        fire_event.click(element, {});

        expect(page_loader_api.data_changes).toEqual(null);

    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': false},
    },
)
