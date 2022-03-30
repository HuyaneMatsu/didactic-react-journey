import {render_in_router, logged_in_test, logged_off_test} from './../../test_utils';
import {render, screen} from '@testing-library/react';
import {Content, CONTENT_TEST_ID} from './../content';
import {LOGIN_STATE} from './../../core';

test(
    'Tests whether the content is displayed',
    function() {
        render_in_router(
            <Content content={ '' } />
        );

        var header_button = screen.getByTestId(CONTENT_TEST_ID);
        expect(header_button).toBeVisible();
    }
)


test(
    'Tests whether the content displays back the content',
    function() {
        var content = 'suika';

        render_in_router(
            <Content content={ <h1> { content } </h1> } />
        );

        var header_button = screen.getByText(content);
        expect(header_button).toBeVisible();
    }
)
