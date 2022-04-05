import {render_in_router, logged_in_test, escape_regex} from './../../../../test_utils';
import {screen} from '@testing-library/react';
import {StatsPageMain} from './../main';
import {to_string, format_date} from './../../../../utils';


logged_in_test(
    'Tests whether currency is shown.',
    function () {
        render_in_router(<StatsPageMain data={ {} } />);

        var element = screen.getByText(new RegExp('Hearts.*'));
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)

logged_in_test(
    'Tests whether streak is shown.',
    function () {
        render_in_router(<StatsPageMain data={ {} } />);

        var element = screen.getByText(new RegExp('Streak.*'));
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)

logged_in_test(
    'Tests whether actual currency is shown.',
    function () {
        render_in_router(<StatsPageMain data={ {'total_love': 100} } />);

        var element = screen.getByText('Hearts 100');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)

logged_in_test(
    'Tests whether actual streak is shown.',
    function () {
        render_in_router(<StatsPageMain data={ {'streak': 100} } />);

        var element = screen.getByText('Streak 100');
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)


logged_in_test(
    'Tests whether hey mister when streak.',
    function () {
        render_in_router(<StatsPageMain data={ {'streak': 100} } />);

        var element = screen.getByText(new RegExp('Hey mister!.*'));
        expect(element).toBeVisible();
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)


logged_in_test(
    'Tests whether no hey mister when no streak.',
    function () {
        render_in_router(<StatsPageMain data={ {} } />);

        var element = screen.queryByText(new RegExp('Hey mister!.*'));
        expect(element).toEqual(null);
    },
    {
        'loader_api_endpoint': '/stats',
        'loader_api_data': {},
    },
)
