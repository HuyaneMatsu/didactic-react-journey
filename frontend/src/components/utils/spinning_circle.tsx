import {ReactElement} from 'react';
import React from 'react';

export var TEST_ID_SPINNING_CIRCLE: string = 'spinning_circle';

export function SpinningCircle(): ReactElement {
    return (
        <div data-testid={ TEST_ID_SPINNING_CIRCLE } className="loader" />
    );
}
