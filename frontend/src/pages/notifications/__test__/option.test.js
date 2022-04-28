import {render_in_router, logged_in_test} from './../../../test_utils';
import {screen, fireEvent as fire_event} from '@testing-library/react';
import {TEST_ID_SPINNING_CIRCLE, TEST_ID_HEADER_NAVIGATOR_BUTTON} from './../../../components';
import {NotificationOption, TEST_ID_NOTIFICATION_OPTION} from './../option';
import {get_handler} from './../../../utils';
import React from 'react';
import {NotificationHolder} from './../types';


logged_in_test(
    'Tests whether data is correctly shown when changed.',
    function () {
        var handler = get_handler('/notification_settings');
        var notification_holder = handler.get_result();

        render_in_router(
            <NotificationOption
                notification_holder={ notification_holder }
                handler={ handler }
                system_name={ 'daily' }
                display_name={ 'Daily' }
            />
        );

        var element = screen.getByTestId(TEST_ID_NOTIFICATION_OPTION);

        fire_event.click(element, {});

        expect(notification_holder.data_changes['daily']).toEqual(false);

    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}),
    },
)

logged_in_test(
    'Tests whether data is correctly. unassigned when changed',
    function () {
        var handler = get_handler('/notification_settings');
        var notification_holder = handler.get_result();

        render_in_router(
            <NotificationOption
                notification_holder={ notification_holder }
                handler={ handler }
                system_name={ 'daily' }
                display_name={ 'Daily' }
            />
        );

        var element = screen.getByTestId(TEST_ID_NOTIFICATION_OPTION);

        fire_event.click(element, {});

        expect(notification_holder.data_changes).toEqual(null);

    },
    {
        'handler_custom_id': '/notification_settings',
        'handler_result': new NotificationHolder().set_data({}).set_changes({'daily': false}),
    },
)
