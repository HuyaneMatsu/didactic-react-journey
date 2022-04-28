import {render_in_router} from './../../test_utils';
import {render, screen} from '@testing-library/react';
import {Content, TEST_ID_CONTENT} from './../content';
import React from 'react';

test(
    'Tests whether the content is displayed',
    function() {
        render_in_router(
            <Content content={ '' } />
        );

        var header_button = screen.getByTestId(TEST_ID_CONTENT);
        expect(header_button).toBeVisible();
    }
)


test(
    'Tests whether the content displays back the content',
    function() {
        var content = 'suika';

        render_in_router(
            <Content content={ <h1>{ content }</h1> } />
        );

        var header_button = screen.getByText(content);
        expect(header_button).toBeVisible();
    }
)
