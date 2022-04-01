import {} from './../../../test_utils';
import {render, screen} from '@testing-library/react';
import {SpinningCircle, TEST_ID_SPINNING_CIRCLE} from './../spinning_circle';


test(
    'Tests whether the spinning circle is displayed',
    function() {
        render(
            <SpinningCircle />
        );
        
        var spinning_circle = screen.getByTestId(TEST_ID_SPINNING_CIRCLE);
        expect(spinning_circle).toBeVisible();
    }
)
