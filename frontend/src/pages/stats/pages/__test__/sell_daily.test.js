import {render_in_router, logged_in_test, escape_regex} from './../../../../test_utils';
import {screen} from '@testing-library/react';
import {StatsPageSellDaily, TEST_ID_STATS_PAGE_SELL_DAILY_INPUT} from './../sell_daily';
import {to_string, format_date} from './../../../../utils';


logged_in_test(
    'Tests whether question is shown',
    function () {
        render_in_router(<StatsPageSellDaily data={ {'streak': 100} }/>);

        var element = screen.getByText(new RegExp('How much.*'));
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loading_api_data': {},
    },
)

logged_in_test(
    'Tests whether approve button is shown',
    function () {
        render_in_router(<StatsPageSellDaily data={ {'streak': 100} }/>);

        var element = screen.getByText('Lets do it!');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loading_api_data': {},
    },
)

logged_in_test(
    'Tests whether back button is shown',
    function () {
        render_in_router(<StatsPageSellDaily data={ {'streak': 100} }/>);

        var element = screen.getByText('Back to safety');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loading_api_data': {},
    },
)


logged_in_test(
    'Tests whether input is shown',
    function () {
        render_in_router(<StatsPageSellDaily data={ {'streak': 100} }/>);

        var element = screen.getByTestId(TEST_ID_STATS_PAGE_SELL_DAILY_INPUT);
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loading_api_data': {},
    },
)

