import {} from './../../../../test_utils';
import {render, screen} from '@testing-library/react';
import {ExceptionPage} from './../page';


test(
    'Tests whether something went wrong is shown',
    function() {
        render(
            <ExceptionPage message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByTestId('Something went wrong');
        expect(element).toBeVisible();
    }
)

test(
    'Tests whether the title is displayed in the loading page',
    function() {
        render(
            <ExceptionPage message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByTestId('Back to safety');
        expect(element).toBeVisible();
    }
)

test(
    'Tests whether the thinking circle is displayed as well',
    function() {
        render(
            <ExceptionPage message={ null } redirect_to={ '/' } />
        );

        var element = screen.getByTestId('Back to safety');
        expect(element).toBeVisible();
    }
)
