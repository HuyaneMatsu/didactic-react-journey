import {render_in_router} from './../../../../test_utils';
import {render, screen} from '@testing-library/react';
import {ExceptionPageContent} from './../content';


test(
    'Tests whether something went wrong is shown',
    function() {
        render_in_router(
            <ExceptionPageContent message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByText('Something went wrong');
        expect(element).toBeVisible();
    }
)

test(
    'Tests whether the title is displayed in the loading page',
    function() {
        render_in_router(
            <ExceptionPageContent message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByText('Back to safety');
        expect(element).toBeVisible();
    }
)

test(
    'Tests whether the thinking circle is displayed as well',
    function() {
        render_in_router(
            <ExceptionPageContent message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByText('Back to safety');
        expect(element).toBeVisible();
    }
)
