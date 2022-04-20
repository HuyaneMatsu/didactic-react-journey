import {ReactElement} from 'react';
import React from 'react';

export var TEST_ID_CONTENT: string = 'content';

interface ContentProps {
    content: ReactElement | string;
};


export function Content({content}: ContentProps): ReactElement {
    return (
        <div className='content' data-testid={ TEST_ID_CONTENT }>
            { content }
        </div>
    );
}
