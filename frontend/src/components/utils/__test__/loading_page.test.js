import {} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {LoadingPage, TEST_ID_LOADING_PAGE_HEADER} from './../loading_page';
import {TEST_ID_SPINNING_CIRCLE} from './../spinning_circle';
import React from 'react';

test(
    'Tests whether the loading page is displayed',
    function() {
        render(
            <LoadingPage title={ null } />
        );

        var spinning_circle = screen.getByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(spinning_circle).toBeVisible();
    }
)

test(
    'Tests whether the title is displayed in the loading page',
    function() {
        var title = 'reach the moon';

        render(
            <LoadingPage title={ title } />
        );

        var title_element = screen.getByText(title);
        expect(title_element).toBeVisible();
    }
)

test(
    'Tests whether the thinking circle is displayed as well',
    function() {
        var title = 'reach the moon';

        render(
            <LoadingPage title={ null } />
        );

        var spinning_circle = screen.getByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(spinning_circle).toBeVisible();
    }
)
