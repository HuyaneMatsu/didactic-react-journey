import {render_in_router, logged_in_test} from './../../../test_utils';
import {screen} from '@testing-library/react';
import {NotificationsPage} from './../page';
import {TEST_ID_SPINNING_CIRCLE, TEST_ID_HEADER_NAVIGATOR_BUTTON} from './../../../components';
import {TEST_ID_SAVE_NOTIFICATIONS_FIELD} from './../save_field';


logged_in_test(
    'Tests whether spinning circle is shown when data is not requested',
    function () {
        render_in_router(<NotificationsPage />);

        var element = screen.getByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/notification_settings',
    },
)

logged_in_test(
    'Tests whether data is shown when requested.',
    function () {
        render_in_router(<NotificationsPage />);

        var key, element;
        for (key of ['Daily', 'Proposal']) {
            element = screen.getByText(key);
            expect(element).toBeVisible();
        }
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
    },
)

logged_in_test(
    'Tests whether save notifications is showed when data is changed.',
    function () {
        render_in_router(<NotificationsPage />);

        var element = screen.getByTestId(TEST_ID_SAVE_NOTIFICATIONS_FIELD);
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
        'loader_api_data_changes': {'daily': true},
    },
)

logged_in_test(
    'Tests whether save notifications is not shown when there are no changes',
    function () {
        render_in_router(<NotificationsPage />);

        var element = screen.queryByTestId(TEST_ID_SAVE_NOTIFICATIONS_FIELD);
        expect(element).toEqual(null);
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
    },
)


logged_in_test(
    'Tests whether the notifications navigator button is clicked.',
    function () {
        render_in_router(<NotificationsPage />);

        var header_button = screen.getByText('Notifications');
        expect(header_button).not.toHaveClass('disabled');
        expect(header_button).toHaveClass('clicked');
    },
    {
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
    },
)


logged_in_test(
    'Whether other buttons are not clicked if notifications is clicked.',
    function() {
        render_in_router(<NotificationsPage />);

        var header_buttons = screen.queryAllByTestId(TEST_ID_HEADER_NAVIGATOR_BUTTON);
        var clicked_button = screen.getByText('Notifications');

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
        'loader_api_endpoint': '/notification_settings',
        'loader_api_data': {},
    },
)
